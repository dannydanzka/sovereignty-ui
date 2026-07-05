# Anti-Patterns — Cross-Discipline Reference

> **Scope**: Universal — applies to ALL disciplines and languages
> **Priority**: Critical — Zero Tolerance
> **Updated**: 2026-03-23

---

## 1. Magic Numbers and Strings

```
// WRONG
if (items.length > 100) { ... }
if (status === 3) { ... }
setTimeout(fn, 86400000);

// CORRECT
const MAX_ITEMS = 100;
const STATUS_ACTIVE = 3;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

if (items.length > MAX_ITEMS) { ... }
if (status === STATUS_ACTIVE) { ... }
setTimeout(fn, ONE_DAY_MS);
```

**Rule**: Extract hardcoded values to named constants. Numbers and strings in logic are opaque — names communicate intent.

---

## 2. God Objects / God Functions

```
// WRONG — one function does everything
processOrder(order) {
  validate(order);
  calculateTax(order);
  applyDiscount(order);
  chargePayment(order);
  sendConfirmation(order);
  updateInventory(order);
  logAnalytics(order);
  // 300+ lines...
}

// CORRECT — single responsibility
validateOrder(order);
const total = calculateOrderTotal(order, tax, discount);
chargePayment(order, total);
notifyOrderConfirmation(order);
updateInventory(order.items);
```

**Rule**: Functions should do one thing. If a function name needs "and" or "then", it does too much.

**Limits**: ~50 lines per function, ~350 lines per file. Exceed = split.

---

## 3. Tight Coupling

```
// WRONG — component knows about database
class UserProfile {
  render() {
    const user = database.query("SELECT * FROM users WHERE id = ?", id);
    return template(user);
  }
}

// CORRECT — dependency inversion
class UserProfile {
  constructor(private userRepository: UserRepository) {}
  render() {
    const user = this.userRepository.findById(id);
    return template(user);
  }
}
```

**Rule**: Depend on abstractions, not implementations. Layers should not skip boundaries.

---

## 4. Dead Code

```
// WRONG — commented-out code, unused functions, unreachable branches
// function oldImplementation() { ... }
function currentImplementation() { ... }

if (false) { legacyPath(); }

export function helperNobodyCalls() { ... }
```

**Rule**: Delete dead code. Git preserves history — commented code is noise, not documentation.

---

## 5. Primitive Obsession

```
// WRONG — passing loose primitives
createUser(name, email, age, isAdmin, role, department);

// CORRECT — structured data
createUser({
  name: "Jane",
  email: "jane@example.com",
  age: 30,
  isAdmin: false,
  role: "developer",
  department: "engineering",
});
```

**Rule**: When a function takes 3+ related parameters, use a structured object/record. Order-dependent positional args are fragile.

---

## 6. Swallowed Errors

```
// WRONG — silent failure
try {
  processPayment(order);
} catch (e) {
  // do nothing
}

// WRONG — generic catch-all
try {
  processPayment(order);
} catch (e) {
  console.log("error");
}

// CORRECT — handle or propagate
try {
  processPayment(order);
} catch (error) {
  logger.error("Payment failed", { orderId: order.id, error });
  throw new PaymentError("Payment processing failed", { cause: error });
}
```

**Rule**: Never swallow errors silently. Log context, re-throw with meaning, or handle explicitly.

---

## 7. Boolean Blindness

```
// WRONG — what do these booleans mean?
processDocument(doc, true, false, true);

// CORRECT — named options
processDocument(doc, {
  validateSchema: true,
  skipAudit: false,
  notifyOwner: true,
});
```

**Rule**: Boolean parameters are unreadable at call sites. Use named options or enums.

---

## 8. Premature Abstraction

```
// WRONG — abstraction for one use case
class AbstractDataProcessorFactory {
  createProcessor(type) { ... }
}
// ...used exactly once

// CORRECT — direct implementation
function processCSVData(data) { ... }
// Abstract later when you have 3+ variants
```

**Rule**: Don't abstract until you have 3+ concrete cases. Duplication is cheaper than the wrong abstraction.

---

## 9. Stringly-Typed Code

```
// WRONG — strings as types
if (user.role === "admin") { ... }
if (status === "pending_review") { ... }

// CORRECT — enums or constants
enum UserRole { ADMIN = "admin", EDITOR = "editor", VIEWER = "viewer" }
enum Status { PENDING_REVIEW = "pending_review", APPROVED = "approved" }

if (user.role === UserRole.ADMIN) { ... }
if (status === Status.PENDING_REVIEW) { ... }
```

**Rule**: Strings used as identifiers are typo-prone and refactor-hostile. Use enums, constants, or union types.

---

## 10. Copy-Paste Programming

```
// WRONG — same logic duplicated in 3 places
// file-a: validateEmail(input) { regex... }
// file-b: checkEmail(input) { same regex... }
// file-c: isValidEmail(input) { same regex... }

// CORRECT — single source of truth
// shared/validators: export function isValidEmail(input) { regex... }
```

**Rule**: If you copy-paste logic, extract it. DRY applies to behavior, not to structure.

---

## Structural Anti-Patterns

| Anti-Pattern | Why It Fails | Fix |
|--------------|-------------|-----|
| Circular dependencies | Build failures, runtime errors, untestable | Restructure: extract shared interface |
| Layer violations | Presentation calling database directly | Enforce dependency direction (inward only) |
| Barrel file abuse | Re-exporting everything defeats tree-shaking | Export only public API from index |
| Implicit dependencies | Function works only because of global state | Pass dependencies explicitly |
| Feature envy | Class A uses more of Class B's data than its own | Move logic to where data lives |
| Shotgun surgery | One change requires edits in 10+ files | Consolidate related logic |

---

## Detection

Most anti-patterns are caught by:
1. **Linters** — dead code, unused variables, complexity limits
2. **Type checkers** — stringly-typed code, any-typed parameters
3. **Code review** — god objects, tight coupling, premature abstraction
4. **Architecture tests** — layer violations, circular dependencies

```bash
# Run your project's validation suite (adapt commands to your stack)
<package-manager> type-check
<package-manager> lint
<package-manager> test
```

---

## Related

- `error-handling.md` — Error handling patterns
- `naming.md` — Naming conventions
- `code-size-limits.md` — File and function size limits
- `dead-code-prevention.md` — Dead code detection
- `type-safety.md` — Strict typing

**Discipline-specific anti-patterns**:
- `frontend/quality/anti-patterns.md` — React, styled-components, Redux patterns

---

**Version**: 2.0 | **Status**: Agnostic — applicable to any language/framework
