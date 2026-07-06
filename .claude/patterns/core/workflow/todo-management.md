# TODO Management

> **Module**: core/workflow
> **Philosophy**: All-or-nothing resolution

---

## TL;DR

**DO**:
- Complete solution ONLY (all-or-nothing)
- 80% understanding, 20% coding
- TODO format: `// TODO: [CATEGORY] - [ACTION] - [MIGRATION PATH]`
- Categories: MIGRATE TO PRISMA, IMPLEMENT, OPTIMIZE, FIX
- Group related TODOs (resolve together)

**DON'T**:
- Delete TODO without implementation
- Partial fixes (inconsistent state)
- Vague TODOs ("Fix later", "Improve")
- Add TODO for <15 min fixes (do immediately)

---

## Why All-or-Nothing

**Partial fixes create problems**:
- Inconsistent data
- Half-migrated code
- Broken functionality

**Complete solution benefits**:
- Consistent state
- Fully tested
- Clean Architecture maintained

---

## Complexity Levels

| Level | Time | Action |
|-------|------|--------|
| 1 | <15 min | Fix immediately (NO TODO) |
| 2 | 15-60 min | Resolve in session |
| 3 | >1 hour | TODO + plan document |

---

## Valid TODO Format

```typescript
// ✅ MIGRATE TO PRISMA
// TODO: MIGRATE TO PRISMA - await prisma.user.findMany({ where: { role: 'admin' } })
const users = mockUsers.filter(u => u.role === 'admin');

// ✅ IMPLEMENT
// TODO: IMPLEMENT - S3 upload (needs AWS credentials)
throw new AppError('Not implemented', 501);

// ❌ INVALID
// TODO: Fix this later
// TODO: Improve
```

---

## Resolution Protocol

1. **Understand**: Read TODO + related files
2. **Dependencies**: Check repos, interfaces, data flow
3. **Plan**: List all files to modify
4. **Implement**: Follow Clean Architecture
5. **Validate**: 0 errors, all tests pass

---

## Validation Checklist

- [ ] 0 TypeScript errors
- [ ] 0 ESLint errors
- [ ] All tests passing
- [ ] No regression
- [ ] Interfaces updated

**If ANY fails**: DO NOT remove TODO

---

## Related

- `core/architecture/clean-architecture.md` - Layer patterns
- `frontend/infrastructure/repositories.md` - Repository patterns

