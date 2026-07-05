# ES6+ Consistency Pattern

**CRITICAL**: ES6 modules and modern syntax MANDATORY across all layers.

## Core Rules

1. **ES6 Modules ONLY**:
   - Use `import/export` statements in all `.js/.ts/.tsx` files
   - `require/module.exports` ONLY in `.cjs` files
   - Detection: If `.js` file uses require/module.exports → suggest rename to `.cjs`

2. **Arrow Functions MANDATORY**:
   - All function declarations use arrow syntax
   - Pattern: `export const functionName = async (params) => {}`
   - NO `function` keyword ANYWHERE (except legacy .cjs files)

3. **Modern Operators**:
   - Nullish coalescing `??` over `||`
   - Optional chaining `?.` for safe access
   - Template literals for strings
   - Destructuring for objects/arrays
   - Spread operator for immutability

4. **Variable Declarations**:
   - `const` by default
   - `let` when reassignment needed
   - NEVER `var`

## Pattern Examples

### Repository Pattern
```typescript
// ✅ CORRECT
export const userRepository = {
  findById: async (id: string) => {
    // implementation
  },
  create: async (data: CreateUserData) => {
    // implementation
  }
};

// ❌ WRONG
export class UserRepository {
  async findById(id: string) { }
}
```

### Use Case Pattern
```typescript
// ✅ CORRECT
export const executeCreateUser = async (
  data: CreateUserData
): Promise<Result<User>> => {
  // implementation
};

// ❌ WRONG
export async function executeCreateUser(data: CreateUserData) { }
```

### API Route Pattern
```typescript
// ✅ CORRECT
export const GET = async (request: NextRequest) => {
  return NextResponse.json({ data });
};

export const POST = async (request: NextRequest) => {
  return NextResponse.json({ data });
};

// ❌ WRONG
export async function GET(request: NextRequest) { }
```

## Zero Tolerance Anti-Patterns

- ❌ NO `function` keyword
- ❌ NO classes for repositories/use cases
- ❌ NO `var`
- ❌ NO `constructor` injection
- ❌ NO `this` keyword in business logic
- ❌ NO `new` for instantiation
- ❌ NO underscore prefixes for "privacy"

## Validation

Run these checks:
```bash
# Find function keyword usage (should be empty)
grep -r "export function" src/

# Find var usage (should be empty)
grep -r "\\bvar\\b" src/

# Find class-based repos/use cases (should be empty)
grep -r "class.*Repository\\|class.*UseCase" src/
```

---

## See also

**Standards**:
- `docs/development-standards/TYPE-SAFETY-STANDARDS.md` - const assertions, readonly
- `docs/development-standards/REPOSITORIES-STANDARDS.md` - Object literal pattern
- `docs/development-standards/USE-CASES-STANDARDS.md` - Arrow function exports

**Patterns**:
- `repository-patterns.md` - Object literal examples
- `use-case-patterns.md` - Arrow function examples

---

**Lines**: 99 | **Status**: ✅ Verified (ES6+ consistency rules)
