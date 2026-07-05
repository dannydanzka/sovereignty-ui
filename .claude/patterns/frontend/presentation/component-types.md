# Component Types Pattern

> **Layer**: Presentation
> **Purpose**: Categorize components by responsibility and behavior
> **Framework**: React + TypeScript
> **Version**: 1.0.0

---

## Overview

Components should be categorized by their primary responsibility. This enables:
- **Predictable behavior** - Know what a component does by its type
- **Proper testing** - Test strategy varies by type
- **Clear boundaries** - Avoid mixing concerns
- **Reusability** - View components are highly reusable

---

## Component Categories

```
┌─────────────────────────────────────────────────────────────────────┐
│                      COMPONENT HIERARCHY                             │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    CONTAINER    │────▶│     UPDATE      │────▶│      VIEW       │
│   (Orchestrate) │     │   (Interact)    │     │   (Display)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
       │                        │                       │
       │                        │                       │
   Screens              Forms, Modals,           Buttons, Cards,
   Pages                Wizards, Editors         Labels, Icons
```

---

## 1. View Components (Presentational)

**Purpose**: Display data. No state management, no side effects.

### Characteristics

| Aspect | Description |
|--------|-------------|
| **State** | None or minimal UI state (hover, focus) |
| **Props** | Data in, callbacks out |
| **Side Effects** | None |
| **Business Logic** | None |
| **Reusability** | High - use across contexts |

### Examples

```typescript
// ✅ Pure View Component
interface UserCardProps {
  name: string;
  email: string;
  avatarUrl: string | null;
  onClick?: () => void;
}

export const UserCard = ({ name, email, avatarUrl, onClick }: UserCardProps) => (
  <CardContainer onClick={onClick}>
    <Avatar src={avatarUrl} alt={name} />
    <Name>{name}</Name>
    <Email>{email}</Email>
  </CardContainer>
);
```

### Common View Components

```
Button              Badge               Avatar
Card                Label               Icon
Input               Spinner             Divider
Text                Image               Skeleton
Link                Tooltip             Progress
```

### Location

```
src/libs/presentation/components/common/
├── Button/
├── Card/
├── Badge/
└── ...
```

### Testing Strategy

```typescript
// Test: renders correctly with props
it('should display user name', () => {
  render(<UserCard name="María García" email="maria@test.com" avatarUrl={null} />);
  expect(screen.getByText('María García')).toBeInTheDocument();
});

// Test: callbacks are called
it('should call onClick when clicked', () => {
  const onClick = vi.fn();
  render(<UserCard {...props} onClick={onClick} />);
  fireEvent.click(screen.getByRole('button'));
  expect(onClick).toHaveBeenCalled();
});
```

---

## 2. Update Components (Interactive)

**Purpose**: Handle user input and mutations. Manage form state.

### Characteristics

| Aspect | Description |
|--------|-------------|
| **State** | Form state, validation state |
| **Props** | Initial values, submit handler |
| **Side Effects** | Form submission, validation |
| **Business Logic** | Validation rules only |
| **Reusability** | Medium - context-specific |

### Examples

```typescript
// ✅ Update Component (Form)
interface UserFormProps {
  initialData?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const UserForm = ({ initialData, onSubmit, onCancel, isLoading }: UserFormProps) => {
  const [formData, setFormData] = useState<UserFormData>(
    initialData ?? DEFAULT_FORM_DATA
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateUserForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    await onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        label="Nombre"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        error={errors.name}
      />
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        error={errors.email}
      />
      <ButtonGroup>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Guardar
        </Button>
      </ButtonGroup>
    </Form>
  );
};
```

### Common Update Components

```
Forms               Wizards             Editors
├── UserForm        ├── EnrollmentWizard  ├── RichTextEditor
├── LoginForm       ├── CheckoutWizard    ├── ImageEditor
├── ContactForm     └── OnboardingWizard  └── ProfileEditor

Modals (with forms)
├── AddUserModal
├── EditEventModal
└── ConfirmDeleteModal
```

### Location

```
src/apps/{context}/presentation/components/
├── forms/
│   ├── UserForm/
│   └── EventForm/
├── modals/
│   ├── AddUserModal/
│   └── EditEventModal/
└── wizards/
    └── EnrollmentWizard/
```

### Testing Strategy

```typescript
// Test: form validation
it('should show error when name is empty', async () => {
  render(<UserForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
  fireEvent.click(screen.getByText('Guardar'));
  expect(await screen.findByText('El nombre es requerido')).toBeInTheDocument();
});

// Test: successful submission
it('should call onSubmit with form data', async () => {
  const onSubmit = vi.fn();
  render(<UserForm onSubmit={onSubmit} onCancel={vi.fn()} />);

  fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'María' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'maria@test.com' } });
  fireEvent.click(screen.getByText('Guardar'));

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'María',
      email: 'maria@test.com',
    });
  });
});
```

---

## 3. Container Components (Orchestrators)

**Purpose**: Compose view and update components. Connect to state/data.

### Characteristics

| Aspect | Description |
|--------|-------------|
| **State** | Redux state, server state |
| **Props** | Route params, minimal config |
| **Side Effects** | Data fetching, navigation |
| **Business Logic** | Orchestration only |
| **Reusability** | Low - route-specific |

### Examples

```typescript
// ✅ Container Component (Screen)
export const UserManagerScreen = () => {
  const { users, isLoading, error, fetchUsers, deleteUser } = useUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId: string) => {
    await deleteUser(userId);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={fetchUsers} />;

  return (
    <ScreenContainer>
      <Header>
        <Title>Gestión de Usuarios</Title>
        <Button onClick={() => setIsModalOpen(true)}>Agregar Usuario</Button>
      </Header>

      <UserTable
        users={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isModalOpen && (
        <UserFormModal
          user={selectedUser}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
          onSuccess={fetchUsers}
        />
      )}
    </ScreenContainer>
  );
};
```

### Naming Convention

| Context | Suffix | Example |
|---------|--------|---------|
| Admin | `Screen` | `UserManagerScreen` |
| Public | `Page` | `EventDetailPage` |
| Shared | `Screen` | `ErrorScreen` |

### Common Container Patterns

```typescript
// Pattern 1: List + Detail
const UsersScreen = () => {
  // List view with modal for detail/edit
};

// Pattern 2: Wizard/Multi-step
const EnrollmentScreen = () => {
  const [step, setStep] = useState(0);
  // Step-by-step flow
};

// Pattern 3: Dashboard
const DashboardScreen = () => {
  // Multiple widgets/sections
};

// Pattern 4: Detail View
const EventDetailPage = () => {
  const { id } = useParams();
  // Single entity display
};
```

### Location

```
src/apps/{context}/presentation/screens/
├── UserManagerScreen/
│   ├── UserManagerScreen.tsx
│   ├── UserManagerScreen.styled.ts
│   ├── UserManagerScreen.interfaces.ts
│   ├── UserManagerScreen.test.tsx
│   └── index.ts
└── DashboardScreen/
```

### Testing Strategy

```typescript
// Test: loading state
it('should show loading spinner while fetching', () => {
  vi.mocked(useUsers).mockReturnValue({ ...defaultReturn, isLoading: true });
  render(<UserManagerScreen />);
  expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
});

// Test: error state
it('should show error when fetch fails', () => {
  vi.mocked(useUsers).mockReturnValue({ ...defaultReturn, error: 'Error' });
  render(<UserManagerScreen />);
  expect(screen.getByText('Error')).toBeInTheDocument();
});

// Test: renders data
it('should render user list', () => {
  vi.mocked(useUsers).mockReturnValue({ ...defaultReturn, users: mockUsers });
  render(<UserManagerScreen />);
  expect(screen.getByText('María García')).toBeInTheDocument();
});
```

---

## 4. Layout Components

**Purpose**: Define page structure and navigation.

### Examples

```typescript
// Header, Footer, Sidebar
export const Header = () => (
  <HeaderContainer>
    <Logo />
    <Navigation />
    <UserMenu />
  </HeaderContainer>
);

// Page Layout
export const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <LayoutContainer>
    <Sidebar />
    <MainContent>{children}</MainContent>
  </LayoutContainer>
);
```

### Location

```
src/libs/presentation/components/layout/
├── Header/
├── Footer/
├── Sidebar/
└── Navigation/

src/libs/presentation/layouts/
├── DashboardLayout/
├── PublicLayout/
└── AuthLayout/
```

---

## Component Composition Rules

### 1. Data Flow Direction

```
Container (fetches data)
    │
    ▼
Update (handles mutations)
    │
    ▼
View (displays data)
```

### 2. Prop Drilling Limit

- Maximum 2-3 levels of prop drilling
- Beyond that, use Context or Redux

### 3. Component Size Guidelines

| Type | Max Lines | Reason |
|------|-----------|--------|
| View | 100 | Should be simple |
| Update | 200 | Forms can be complex |
| Container | 250 | Orchestration overhead |
| Screen | 300 | May include multiple sections |

### 4. State Location

| State Type | Location |
|------------|----------|
| Server data | Redux / React Query |
| Form data | Update component (useState) |
| UI state (modal open) | Container component |
| Theme, auth | Context providers |

---

## Decision Tree

```
Creating a new component?
│
├── Does it only display data?
│   └── YES → View Component
│
├── Does it handle user input/forms?
│   └── YES → Update Component
│
├── Does it fetch data or compose other components?
│   └── YES → Container Component
│
└── Does it define page structure?
    └── YES → Layout Component
```

---

## File Structure by Type

### View Component

```
Button/
├── Button.tsx              # Component
├── Button.styled.ts        # Styles
├── Button.interfaces.ts    # Props interface
├── Button.test.tsx         # Tests
└── index.ts                # Export
```

### Update Component

```
UserForm/
├── UserForm.tsx            # Component
├── UserForm.styled.ts      # Styles
├── UserForm.interfaces.ts  # Props + form types
├── UserForm.constants.ts   # Default values, validation
├── UserForm.test.tsx       # Tests
└── index.ts                # Export
```

### Container Component

```
UserManagerScreen/
├── UserManagerScreen.tsx
├── UserManagerScreen.styled.ts
├── UserManagerScreen.interfaces.ts
├── UserManagerScreen.constants.ts
├── UserManagerScreen.test.tsx
├── hooks/                  # Screen-specific hooks
│   └── useUserManager.ts
├── components/             # Screen-specific components
│   └── UserFilters/
└── index.ts
```

---

## Anti-Patterns

### ❌ Don't

```typescript
// View component fetching data
const UserCard = ({ userId }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetchUser(userId).then(setUser);  // ❌ Side effect in view
  }, []);
  return <Card>{user?.name}</Card>;
};

// Container with inline styles
const UserScreen = () => (
  <div style={{ padding: 20 }}>  {/* ❌ Inline styles */}
    ...
  </div>
);

// Update component accessing Redux directly
const UserForm = () => {
  const dispatch = useDispatch();  // ❌ Should receive onSubmit prop
  ...
};
```

### ✅ Do

```typescript
// View receives data via props
const UserCard = ({ user, onClick }) => (
  <Card onClick={onClick}>{user.name}</Card>
);

// Container handles data fetching
const UserScreen = () => {
  const { user } = useUser(userId);
  return <UserCard user={user} onClick={handleClick} />;
};

// Update receives callbacks
const UserForm = ({ onSubmit }) => {
  const handleSubmit = (data) => onSubmit(data);
  ...
};
```

---

## Related Documentation

- `.claude/patterns/frontend/presentation/components.md` - Component structure
- `.claude/patterns/frontend/presentation/hooks.md` - Custom hooks
- `.claude/patterns/frontend/presentation/styling/` - Styling patterns

---

**Pattern Version**: 1.0.0 | **Created**: 2026-02-12
