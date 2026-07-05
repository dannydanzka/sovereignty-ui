# Context Sovereignty Pattern

> **Scope**: Shared (web + mobile) — SOLID for Redux state management
> **Sovereignty principle**: Territorial Integrity — each context owns its entire ecosystem
> **Applies to**: Redux + Sagas, Redux Toolkit, any state management with domain contexts

---

## Principle

Each context (domain) owns its entire ecosystem and is the **single source of truth** for its data and operations. Consumers must request directly from the owning context, never through intermediaries.

---

## The Ecosystem Stack

```
┌─────────────────────────────────────────────────────────────┐
│ CONTEXT ECOSYSTEM (e.g., promotions, cart, auth)            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Services ──► Sagas ──► Actions ──► Reducers ──► Selectors  │
│                                          │                   │
│                                          ▼                   │
│                                       Hooks ◄── Consumers    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

Each layer belongs to its context. No external context should bypass or re-export.

---

## Anti-Pattern: The Intermediary

```typescript
// WRONG — useOrderProductList re-exporting offersDetail
const useOrderProductList = () => {
  const { offersDetail, clearOffersDetail } = useOffersDetail();

  return {
    offersDetail,        // Re-exporting from another context!
    clearOffersDetail,
    // ... own actions
  };
};

// Consumer uses intermediary
const { offersDetail } = useOrderProductList(); // Wrong source
```

**Problem**: Creates confusion about data ownership and breaks single source of truth.

---

## Correct Pattern: Direct Consumption

```typescript
// CORRECT — Each hook owns only its domain
const useOrderProductList = () => {
  return {
    addProduct,
    removeProduct,
    setProductQuantity,
  };
};

// Consumer requests from each owner directly
const { offersDetail } = useOffersDetail();              // From owner
const { addProduct } = useOrderProductList();             // From owner
const { conditionalProducts } = useConditionalProducts(); // From owner
```

---

## Sovereignty Rules by Layer

### Services
```typescript
// CORRECT: Each context has its own service
const promotionsService = PromotionService(config.PROMOTIONS_API);

// WRONG: Calling another context's service
const orderService = () => ({
  getOffersDetail: promotionsService.getOffersDetail, // Wrong!
});
```

### Actions
```typescript
// CORRECT: Actions belong to their context
// promotions/actions.ts
export const setOffersDetail = (data) => ({
  type: 'PROMOTIONS/SET_OFFERS_DETAIL', payload: data
});

// WRONG: Duplicate actions across contexts
// electronicOrder/actions.ts
export const setOffersDetail = (data) => ({ ... }); // Delete this!
```

### Selectors
```typescript
// CORRECT: Query own context's state
// promotions/selectors.ts
export const getOffersDetail = (state) => state.promotions.offersDetail;

// WRONG: Selector reaching into other context
// electronicOrder/selectors.ts
export const getOffersDetail = (state) => state.promotions.offersDetail; // Wrong location!
```

### Hooks
```typescript
// CORRECT: Expose only what you own
export const useOffersDetail = () => {
  const offersDetail = useSelector(getOffersDetail);
  const dispatch = useDispatch();
  return {
    offersDetail,
    fetchOffersDetail: (params) => dispatch(getOffersDetailAction(params)),
    clearOffersDetail: () => dispatch(clearOffersDetailAction()),
  };
};

// WRONG: Re-exporting from another hook
export const useOrderProductList = () => {
  const { offersDetail } = useOffersDetail();
  return { offersDetail }; // Re-exporting!
};
```

---

## Decision Checklist

| Question | If Yes | If No |
|----------|--------|-------|
| Does this data originate from this context's API? | Add here | Find owner |
| Does this action modify this context's reducer? | Add here | Find owner |
| Is another context already exposing this? | Use theirs | Add here |
| Am I re-exporting from another hook? | Remove it | Keep it |

---

## Migration Steps

When you find sovereignty violations:

1. **Identify the owner**: Which context's API provides this data?
2. **Check for duplicates**: Remove duplicate actions/reducers/selectors
3. **Update consumers**: Import from owner, not intermediary
4. **Remove re-exports**: Clean intermediary hooks
5. **Verify**: Each context only exposes what it owns

---

## Related

- `core/architecture/code-sovereignty.md` — 6 technical sovereignty principles
- `frontend/infrastructure/state/redux.md` — Redux patterns
- `frontend/infrastructure/state/selectors.md` — Selector patterns
- `frontend/presentation/hooks.md` — Hook patterns
