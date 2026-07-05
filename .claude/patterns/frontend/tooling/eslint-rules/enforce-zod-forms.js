/**
 * ESLint Rule: enforce-zod-forms
 *
 * CODE SOVEREIGNTY PRINCIPLE: Explicit Governance + Controlled Exceptions
 *
 * Enforces that all forms use react-hook-form + Zod validation instead of
 * manual useState + validateForm patterns.
 *
 * DETECTED PATTERNS:
 * ❌ useState<*FormData> (manual form state)
 * ❌ validateForm() function declarations
 * ❌ useState<*FormErrors> (manual error state)
 *
 * RECOMMENDED PATTERN:
 * ```typescript
 * // ✅ GOOD: useForm + zodResolver
 * import { useForm } from 'react-hook-form';
 * import { zodResolver } from '@hookform/resolvers/zod';
 * import { myFormSchema } from './MyForm.validation';
 *
 * const form = useForm<MyFormData>({
 *   resolver: zodResolver(myFormSchema),
 * });
 * ```
 *
 * EXCEPTIONS:
 * - Test files (*.test.ts, *.test.tsx)
 * - Mock files
 * - Files with eslint-disable comment for this rule
 */

/** @type {import('eslint').Rule.RuleModule} */
export const enforceZodFormsRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce react-hook-form + Zod for all form validation',
    },
    messages: {
      noManualFormState:
        'Use useForm() from react-hook-form instead of useState<{{typeName}}>. See forms.md pattern.',
      noManualFormErrors:
        'Use formState.errors from react-hook-form instead of manual error state. See forms.md pattern.',
      noValidateForm:
        'Use zodResolver + form.trigger() instead of manual validateForm(). See forms.md pattern.',
    },
    schema: [],
  },
  create(context) {
    const filename = context.filename || context.getFilename();

    // Skip test files
    if (filename.includes('.test.') || filename.includes('.spec.') || filename.includes('__mocks__')) {
      return {};
    }

    // Skip validation files (they define schemas, not use them)
    if (filename.includes('.validation.')) {
      return {};
    }

    return {
      // Detect useState<*FormData> or useState<*FormErrors>
      CallExpression(node) {
        if (
          node.callee.type !== 'Identifier' ||
          node.callee.name !== 'useState'
        ) {
          return;
        }

        // Check for type argument like useState<SomeFormData>
        const typeParams = node.typeParameters || node.typeArguments;
        if (!typeParams || !typeParams.params || typeParams.params.length === 0) {
          return;
        }

        const typeParam = typeParams.params[0];
        let typeName = '';

        if (typeParam.type === 'TSTypeReference' && typeParam.typeName) {
          typeName = typeParam.typeName.type === 'Identifier'
            ? typeParam.typeName.name
            : '';
        }

        if (!typeName) return;

        if (typeName.endsWith('FormData') || typeName.endsWith('FormValues')) {
          context.report({
            node,
            messageId: 'noManualFormState',
            data: { typeName },
          });
        }

        if (typeName.endsWith('FormErrors')) {
          context.report({
            node,
            messageId: 'noManualFormErrors',
            data: { typeName },
          });
        }
      },

      // Detect const validateForm = ... function declarations
      VariableDeclarator(node) {
        if (
          node.id.type === 'Identifier' &&
          node.id.name === 'validateForm' &&
          node.init
        ) {
          context.report({
            node,
            messageId: 'noValidateForm',
          });
        }
      },
    };
  },
};
