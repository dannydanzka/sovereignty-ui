/**
 * ESLint Rule: no-utility-type-cast
 *
 * Forbids type-extracting utility types (Parameters, ReturnType, ComponentProps, …)
 * inside `as` casts and angle-bracket assertions.
 *
 * WHY:
 * These casts extract a prop/field type from a function or component's signature
 * at the use-site instead of importing the interface directly. They create
 * invisible coupling: if the supplier renames a param or restructures its
 * function signature the consumer silently breaks with no TS error at the
 * definition — only at the cast.
 *
 * FORBIDDEN:
 *   value as Parameters<typeof TotalAssociates>[0]['associates']
 *   hook() as ReturnType<typeof useMyHook>['someField']
 *   x as React.ComponentProps<typeof Button>['onClick']
 *   (<ConstructorParameters<typeof MyClass>[0]>value)
 *
 * ALLOWED:
 *   value as MyInterface                   // import the interface directly
 *   value as unknown as MyInterface        // double-cast for JS-origin components
 *   value as Pick<MyInterface, 'field'>    // structural subset (no type extraction)
 *   type Foo = Parameters<typeof fn>[0]    // type alias declaration (not a cast)
 *   x as unknown as ReturnType<typeof vi.fn>   // test-mock factory (3rd-party, no importable interface)
 *
 * FIX:
 *   Export a named interface from the component/hook's .interfaces.ts file and
 *   import it directly. Or define a local type alias (not a cast) for test-local
 *   helpers that don't warrant a standalone interface:
 *     // ❌
 *     x as Parameters<typeof TotalAssociates>[0]['associates']
 *     // ✅ — declare at origin and import
 *     import type { TotalAssociatesAssociates } from './TotalAssociates.interfaces';
 *     x as TotalAssociatesAssociates
 *     // ✅ — local type alias in test files (not a cast)
 *     type TestState = ReturnType<typeof buildState>;
 *     store.getState() as TestState
 *
 * Reference: core/quality/type-safety.md (Code Sovereignty — Clear Borders).
 * Adapted from BN3 shared rule (Mobile + Web, same implementation).
 *
 * @version 1.1.0
 * @reviewed 2026-06-19
 */

/** Utility types whose primary purpose is extracting types from other types */
const EXTRACTION_UTILITY_TYPES = new Set([
  'Parameters',
  'ReturnType',
  'ComponentProps',
  'ComponentPropsWithRef',
  'ComponentPropsWithoutRef',
  'ConstructorParameters',
  'InstanceType',
]);

/**
 * Returns the leaf name of a type reference name node.
 * Handles both plain Identifiers and qualified names (React.ComponentProps).
 */
function getTypeName(nameNode) {
  if (!nameNode) return null;
  if (nameNode.type === 'Identifier') return nameNode.name;
  if (nameNode.type === 'TSQualifiedName') return getTypeName(nameNode.right);
  return null;
}

/** Test-mock factories whose return type has no first-party interface to import. */
const TEST_MOCK_FACTORIES = new Set(['vi.fn', 'vitest.fn', 'jest.fn']);

/**
 * Returns true when a TSTypeReference is `ReturnType<typeof <factory>>` for a
 * known test-mock factory (vi.fn / vitest.fn / jest.fn). These extract the type
 * of a 3rd-party mock util — there is no .interfaces.ts to import — so they are
 * the canonical way to type a mock and must NOT be flagged.
 */
function isTestMockFactoryExtraction(typeNode) {
  if (typeNode.type !== 'TSTypeReference') return false;
  if (getTypeName(typeNode.typeName) !== 'ReturnType') return false;
  // typescript-eslint exposes type args as `typeArguments` (new) or `typeParameters` (old).
  const args = typeNode.typeArguments || typeNode.typeParameters;
  const arg = args && args.params && args.params[0];
  if (!arg || arg.type !== 'TSTypeQuery') return false;
  const name = qualifiedName(arg.exprName);
  return TEST_MOCK_FACTORIES.has(name);
}

/** Flattens a (possibly qualified) name node to a dotted string: vi.fn → "vi.fn". */
function qualifiedName(nameNode) {
  if (!nameNode) return '';
  if (nameNode.type === 'Identifier') return nameNode.name;
  if (nameNode.type === 'TSQualifiedName') {
    return `${qualifiedName(nameNode.left)}.${qualifiedName(nameNode.right)}`;
  }
  return '';
}

/**
 * Recursively walks a type node and returns the first forbidden utility type
 * name it finds, or null if none.
 *
 * Only walks through TSIndexedAccessType chains (T[K][L]) because that is the
 * specific structural pattern of the prohibited casts. Stops at anything else
 * to avoid false-positives inside union/intersection members.
 */
function findForbiddenType(typeNode) {
  if (!typeNode) return null;

  if (typeNode.type === 'TSTypeReference') {
    // Allow ReturnType<typeof vi.fn|vitest.fn|jest.fn> — 3rd-party mock typing.
    if (isTestMockFactoryExtraction(typeNode)) return null;
    const name = getTypeName(typeNode.typeName);
    if (name && EXTRACTION_UTILITY_TYPES.has(name)) return name;
    return null;
  }

  // `Parameters<typeof X>[0]['prop']`  →  TSIndexedAccessType chain
  if (typeNode.type === 'TSIndexedAccessType') {
    return findForbiddenType(typeNode.objectType);
  }

  return null;
}

/** @type {import('eslint').Rule.RuleModule} */
export const noUtilityTypeCastRule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow type-extracting utility types (Parameters, ReturnType, ComponentProps…) in `as` casts. Import the interface directly.',
      category: 'Type Safety',
      recommended: true,
    },
    messages: {
      forbidden:
        '"as {{typeName}}<…>" extracts a type from a function/component signature at the use-site. ' +
        'Export a named interface from the source .interfaces.ts file and import it directly. ' +
        'In test files, define a local type alias (type Foo = …) instead of casting.',
    },
    schema: [],
  },

  create(context) {
    function check(node, typeAnnotation) {
      const name = findForbiddenType(typeAnnotation);
      if (name) {
        context.report({ node, messageId: 'forbidden', data: { typeName: name } });
      }
    }

    return {
      // `value as Parameters<typeof X>[0]['prop']`
      TSAsExpression(node) {
        check(node, node.typeAnnotation);
      },

      // `(<Parameters<typeof X>[0]>value)` — legacy angle-bracket syntax
      TSTypeAssertion(node) {
        check(node, node.typeAnnotation);
      },
    };
  },
};
