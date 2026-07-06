# Error Handling Pattern — React Native

> **Scope**: Mobile-only error chain (backend → AppError → saga → i18n → UI)
> **Sovereignty principle**: Explicit Governance — error flows documented, not implicit

---

## Error Flow

```
Backend Response
    ↓
defaultErrorHandling (services/utils)
    ↓
AppError (thrown)
    ↓
sagaHandler (catch)
    ↓
Redux Store (error state)
    ↓
Component (useEffect)
    ↓
handleCustomError → getMessageFromError → extractMessage
    ↓
t(message) → i18n translation
    ↓
UI Notification
```

---

## Backend Error Formats

Backend has NO standard format. Expect multiple structures:

| Format | Example | Handling |
|--------|---------|----------|
| Structured string | `"BetterNet.Services.Exchange.Application.errors.messages.ErrorKey"` | `extractMessage` → `errorHandling.errors.ErrorKey` |
| Object with code | `{ error: { code: "ErrorKey", description: "..." } }` | Extract `description` or `code` |
| Object with description | `{ error: { description: "User message" } }` | Use `description` directly |
| Direct string | `"Lo sentimos, ha ocurrido un error."` | Use as-is |

---

## Key Files

```
src/
├── services/utils/
│   └── defaultErrorHandling.js        # Normalizes HTTP errors → AppError
├── utils/
│   ├── classes/
│   │   └── AppError.js                # Error class with content + message
│   └── helpers/errorHandling/
│       └── errorHandling.helpers.js   # extractMessage, handleCustomError
├── state/
│   ├── actions/global/
│   │   └── global.js                  # errorNotification (uses i18n.t)
│   └── sagas/global/
│       └── global.js                  # sagaHandler, translateError
└── assets/i18n/
    └── es.json                        # ALL translations (single file)
```

---

## extractMessage

```javascript
// Transforms structured backend string to i18n key
const extractMessage = (message) => {
  const sections = message.split('.');
  return `errorHandling.errors.${sections[sections.length - 1]}`;
};

// Input:  "BetterNet.Services.Exchange.Application.errors.messages.ErrorKey"
// Output: "errorHandling.errors.ErrorKey"
```

---

## i18n Translation Location

Mobile uses a SINGLE i18n file (simpler than web):

```json
// src/assets/i18n/es.json
{
  "translation": {
    "errorHandling": {
      "errors": {
        "ErrorKey": "Translated error message."
      }
    }
  }
}
```

| Platform | i18n Files | Notes |
|----------|------------|-------|
| Mobile | `src/assets/i18n/es.json` (1 file) | All translations in one place |
| Web | Multiple files (lib-utils, lib-ui, mod-*) | Context-dependent resolution |

---

## sagaHandler Flow

```javascript
export function* sagaHandler({
  action,
  saga,
  errorActionCreator,
  showErrorNotification = true,
  translate = undefined,
}) {
  try {
    const response = yield saga(action);
    yield put(successActionCreator(response));
  } catch (error) {
    yield put(errorActionCreator(translate?.(error)?.translated ?? error));

    if (showErrorNotification) {
      yield put(globalActionCreators.errorNotification(null, error));
    }
  }
}
```

| showErrorNotification | Behavior | Translation |
|-----------------------|----------|-------------|
| `true` | Auto notification via `errorNotification` | `i18n.t(error.message)` in action |
| `false` | Component handles error | Component uses `t(message)` |

**Warning**: If both `showErrorNotification: true` AND component translates = DOUBLE TRANSLATION.

---

## Adding New Error Translation

1. **Identify** error string from backend
2. **Extract** key name (last segment after `split('.')`)
3. **Add** to `src/assets/i18n/es.json` under `errorHandling.errors`
4. **Verify** the full flow

---

## Anti-Patterns

| Anti-Pattern | Correct |
|-------------|---------|
| Add translation with full `BetterNet.Services.*` structure | Add to `errorHandling.errors.{Key}` |
| Translate twice (sagaHandler + component) | Choose one: auto or manual |
| Hardcode error messages | Always use i18n |
| Create multiple i18n files | Mobile uses single file |

---

## Related

- `mobile/service-layer.md` — API service patterns
- `frontend/infrastructure/state/redux.md` — Saga patterns
- `core/quality/error-handling.md` — Cross-discipline error handling
