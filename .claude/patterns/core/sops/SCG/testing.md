# SCG Step 8: Testing

> **Input**: Implemented feature (SCG step 6 complete)
> **Output**: Unit tests for all touched code

---

## Procedure

### 8.1 Identify what to test

Every file we touched or created needs test coverage:

| File type | Test approach |
|-----------|--------------|
| Hook | `renderHook` with `TestWrapper` (Redux provider) |
| Selector | Direct call with mock state |
| Saga | Export worker, test with `expectSaga` or manual |
| Service | Mock `handleYOUR-PROJECTRequest`, verify params |
| Component | RTL: render, interact, assert |
| Helper/util | Direct call, pure function testing |

### 8.2 Test pattern: AAA

```typescript
describe('featureName', () => {
  it('should do expected behavior', () => {
    // Arrange — setup state, mocks, inputs
    const mockState = { ...initialState, field: 'value' };

    // Act — execute the function/hook/component
    const result = selector(mockState);

    // Assert — verify the output
    expect(result).toBe('expected');
  });
});
```

### 8.3 Query priority (components)

```
getByRole → getByLabelText → getByText → getByTestId
```

Use `getByTestId` only as last resort.

### 8.4 JS-origin error triage

After writing tests, if TS errors appear:

| Error source | Action |
|-------------|--------|
| Our test file | FIX |
| Our implementation file | FIX |
| Imported `.js` dependency | SKIP — add `@ts-expect-error` with comment |
| `.d.ts` of JS component | SKIP — incomplete manual types |

### 8.5 Coverage target

| Metric | Minimum |
|--------|---------|
| Statements | 75% |
| Branches | 60% |
| Functions | 65% |
| Lines | 75% |

---

## Rules

- Test BEHAVIOR, not implementation details
- Mock external dependencies (APIs, navigation, async storage)
- NEVER test third-party library internals
- Name tests as behavior descriptions: `should show error when API fails`
- One assertion per test when possible
