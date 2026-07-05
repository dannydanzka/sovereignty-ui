# Service Layer

> **Module**: frontend/infrastructure
> **ESLint**: `custom/no-direct-service-calls`

---

## TL;DR

**DO**:
- Object literal pattern: `export const Service = { ... }`
- Arrow functions ONLY
- handleRequest for ALL HTTP calls
- Return raw API data (transform in Redux)
- Spanish error messages

**DON'T**:
- Classes or constructors
- Direct fetch/axios
- Transform data in services
- Business logic (use Use Cases)

---

## Service Responsibility

Services = HTTP client layer (nothing more)

| CAN DO | CANNOT DO |
|--------|-----------|
| HTTP calls via handleRequest | Business logic |
| Response type assertions | Data transformation |
| Error handling (throw/empty) | Validation |

---

## Basic Service

```typescript
import { handleRequest } from '@helpers';
import type { ApiResponse } from '@domain-types';

export const UsersService = {
  getAll: async (): Promise<UserApiData[]> => {
    const response = await handleRequest({
      endpoint: '/api/admin/users',
      method: 'GET',
      timeout: 10000,
      customDefaultErrorMessage: 'No se pudieron cargar los usuarios',
    });

    const typedResponse = response as ApiResponse<{ users: UserApiData[] }>;
    if (!typedResponse.success || !typedResponse.data?.users) {
      return [];  // Empty array on error
    }

    return typedResponse.data.users;
  },

  getById: async (id: string): Promise<UserApiData> => {
    const response = await handleRequest({
      endpoint: `/api/admin/users/${id}`,
      method: 'GET',
      timeout: 8000,
      customDefaultErrorMessage: 'No se pudo cargar el usuario',
    });

    const typedResponse = response as ApiResponse<UserApiData>;
    if (!typedResponse.success || !typedResponse.data) {
      throw new Error('Usuario no encontrado');  // Throw on error
    }

    return typedResponse.data;
  },

  delete: async (id: string): Promise<void> => {
    const response = await handleRequest({
      endpoint: `/api/admin/users/${id}`,
      method: 'DELETE',
      timeout: 8000,
      customDefaultErrorMessage: 'No se pudo eliminar',
    });

    if (!response.success) {
      throw new Error('No se pudo eliminar');
    }
  },
};
```

---

## Response Handling

| Return Type | Strategy | Example |
|-------------|----------|---------|
| Array | Return `[]` on error | getAll() |
| Single Object | Throw on error | getById() |
| Void | Throw on error | delete() |

---

## Query Parameters

```typescript
getFiltered: async (filters: Filters): Promise<Item[]> => {
  const params = new URLSearchParams();

  if (filters.status) params.append('status', filters.status);
  if (filters.search) params.append('search', filters.search);

  const queryString = params.toString();
  const endpoint = `/api/items${queryString ? `?${queryString}` : ''}`;

  const response = await handleRequest({ endpoint, method: 'GET' });
  // ...
}
```

---

## File Structure

```
services/admin/users/
├── users.service.ts
├── users.service.interfaces.ts
└── index.ts
```

```typescript
// index.ts
export * from './users.service';
export type * from './users.service.interfaces';
```

---

## Why Object Literal (NOT Classes)

- No `new` keyword needed
- No `this` binding issues
- Tree-shaking friendly
- Easier to test

---

## Why NO Transform in Services

Services return raw API data. Transformation happens in Redux thunks.

**Why**: Separation of concerns. Same service can be used with different transformations.

---

## Related

- `frontend/infrastructure/state/redux.md` - Redux integration
- `frontend/infrastructure/state/slices.md` - Slice patterns

