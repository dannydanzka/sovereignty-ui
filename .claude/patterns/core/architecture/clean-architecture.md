# Clean Architecture

> **Module**: core/architecture
> **ESLint**: `custom/architecture-boundaries`

---

## TL;DR

**DO**:
- Dependencies flow INWARD (outer → inner)
- Domain has ZERO external dependencies
- Use Cases = pure business logic
- Routes/Controllers = thin delegation

**DON'T**:
- Import outer layers from inner layers
- Put business logic in routes/controllers
- Call HTTP/database from domain
- Skip layers (route → repository directly)

---

## Why

Clean Architecture ensures:
- **Testability**: Business logic without mocks
- **Flexibility**: Swap infrastructure (mock → real DB)
- **Clarity**: Each layer has one responsibility
- **Scalability**: Teams work independently

---

## Layers

```
┌─────────────────────────────────────────────────┐
│              PRESENTATION                        │
│         (Components, Pages, Routes)              │
├─────────────────────────────────────────────────┤
│              INFRASTRUCTURE                      │
│      (Repositories, Services, State)             │
├─────────────────────────────────────────────────┤
│                 DOMAIN                           │
│        (Entities, Use Cases, Interfaces)         │
└─────────────────────────────────────────────────┘
         ↑ Dependencies point INWARD ↑
```

| Layer | Responsibility | Can Import |
|-------|----------------|------------|
| **Domain** | Business logic, entities | Nothing |
| **Infrastructure** | Data access, external services | Domain interfaces |
| **Presentation** | UI, HTTP routing | Infrastructure |

---

## Backend Flow

```
Route → Use Case → Repository → Database
```

```typescript
// Route: thin, delegates only
export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await executeCreateUser(body, userRepository);
  return NextResponse.json(result);
}

// Use Case: pure business logic
const executeCreateUser = async (
  data: CreateUserRequest,
  repo: UserRepository  // Interface, not implementation
): Promise<Result<User>> => {
  if (!isValidEmail(data.email)) {
    return { success: false, error: 'INVALID_EMAIL' };
  }
  return repo.create(data);
};

// Repository: data access only
export const userRepository: UserRepository = {
  create: async (data) => prisma.user.create({ data }),
};
```

---

## Frontend Flow

```
Component → Hook → Redux Thunk → Service → API
```

```typescript
// Component: pure UI
const UserList = () => {
  const { users, isLoading } = useUsers();
  return <List items={users} loading={isLoading} />;
};

// Hook: encapsulates state access
const useUsers = () => {
  const users = useAppSelector(selectUsers);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return { users, isLoading: users.loading };
};
```

---

## Context Boundaries

```
admin/     → Admin-specific code
public/    → Public-facing code
libs/      → Shared (explicit decision)
```

**Rule**: NO cross-context imports.
- admin ↛ public
- public ↛ admin
- Shared code → libs/

---

## Related

- `core/architecture/code-sovereignty.md` - Philosophy
- `core/architecture/anti-patterns.md` - What NOT to do (violations + ESLint enforcement)
- `frontend/domain/use-cases.md` - Use case patterns
- `frontend/infrastructure/repositories.md` - Repository patterns
