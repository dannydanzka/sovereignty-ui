# Code Sovereignty - Architectural Philosophy

> **Concept**: Code architecture mirroring geopolitical sovereignty principles
> **Scope**: Universal architectural pattern (applicable to ALL projects)
> **Status**: Production-validated across multiple codebases
> **ESLint Enforcement**: `custom/architecture-boundaries`
> **Author**: Roberto Ramirez (based on Clean Architecture + SOLID + Clean Code)

---

## The Analogy: Peace vs War

### World at War (Coupled Architecture)

```
┌─────────────────────────────────────────────────────────┐
│              INTERVENTIONIST ARCHITECTURE                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Country A (UI Layer)                                   │
│    ├─ Invades → Country B (Business Logic)             │
│    ├─ Steals resources → Country C (Database)          │
│    └─ Creates dependency → Military alliance required   │
│                                                          │
│  Result: Change in A → cascades to B, C, D, E...       │
│          Constant conflicts, unstable borders            │
│          Resource wars, circular dependencies            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Symptoms**:
- UI components calling database directly
- Business logic scattered across layers
- Circular dependencies (A needs B, B needs A)
- Changes cascade across entire system
- Testing requires entire system running
- "Military alliances" (tight coupling to survive)

### World at Peace (Sovereign Architecture)

```
┌─────────────────────────────────────────────────────────┐
│               SOVEREIGN ARCHITECTURE                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Nation A (Presentation)                                │
│    ├─ Sovereign borders (interfaces)                    │
│    ├─ Self-sufficient (own state management)           │
│    └─ Trade agreements (dependency injection)           │
│                                                          │
│  Nation B (Domain/Business)                             │
│    ├─ Sovereign borders (no external dependencies)      │
│    ├─ Self-sufficient (pure business logic)            │
│    └─ Export treaties (defined interfaces)              │
│                                                          │
│  Nation C (Infrastructure)                              │
│    ├─ Sovereign borders (repository patterns)           │
│    ├─ Self-sufficient (implements interfaces)          │
│    └─ Service agreements (dependency inversion)         │
│                                                          │
│  Result: Change in A → isolated to A                    │
│          Stable borders, clear contracts                 │
│          Trade (data flow) without invasion              │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Characteristics**:
- Each layer has sovereignty over its domain
- Clear borders (interfaces, boundaries)
- No interventionism (dependencies point inward)
- Trade agreements (dependency injection, interfaces)
- Self-sufficiency within domain
- Peace treaties (contracts, protocols)

---

## Sovereignty Principles (6 Principles)

### 1. Territorial Integrity (Layer Boundaries)

**Definition**: Each layer owns its territory exclusively.

**In Code**:
```typescript
// ✅ SOVEREIGN: Domain layer (pure business logic, NO external dependencies)
export const calculateTotalPrice = (
  items: CartItem[],
  discountRules: DiscountRule[]
): Price => {
  // Pure function, no IO, no framework dependencies
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = applyDiscountRules(subtotal, discountRules);
  return { amount: subtotal - discount, currency: 'USD' };
};

// ❌ INTERVENTIONIST: Domain calling infrastructure
export const calculateTotalPrice = async (cartId: string): Promise<Price> => {
  const items = await prisma.cartItem.findMany({ where: { cartId } }); // 🚨 INVASION
  // Domain invaded by infrastructure (Prisma)
};
```

**Treaty**: Domain NEVER imports from infrastructure. Infrastructure implements domain interfaces.

---

### 2. Self-Sufficiency (Single Responsibility)

**Definition**: Each nation (module/layer) should be self-sufficient within its domain.

**In Code**:
```typescript
// ✅ SOVEREIGN: Component manages its own presentation logic
export const UserCard = ({ user }: UserCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false); // Own state
  const formattedDate = formatDate(user.createdAt);    // Own formatting

  return (
    <Container>
      <Name>{user.name}</Name>
      {isExpanded && <Details>{formattedDate}</Details>}
    </Container>
  );
};

// ❌ INTERVENTIONIST: Component depends on global state for local UI
export const UserCard = ({ user }: UserCardProps) => {
  const isExpanded = useGlobalUIState(state => state.userCards[user.id]); // 🚨 DEPENDENCY
  // Component lost sovereignty, depends on external state for local concern
};
```

**Treaty**: Each component sovereign over its own UI state.

---

### 3. Non-Intervention (Dependency Inversion)

**Definition**: Higher layers do NOT invade lower layers. Dependencies point inward.

**In Code**:
```typescript
// ✅ SOVEREIGN: Use Case depends on interface (not implementation)
import type { UserRepository } from '@domain/interfaces';

export const executeCreateUser = async (
  request: CreateUserRequest,
  userRepository: UserRepository // Injected dependency
): Promise<UseCaseResponse<User>> => {
  // Use Case doesn't know if repository uses Prisma, MongoDB, or mocks
  const user = await userRepository.create(request);
  return { success: true, data: user };
};

// ❌ INTERVENTIONIST: Use Case depends on infrastructure
import { prisma } from '@infrastructure/database'; // 🚨 INVASION

export const executeCreateUser = async (
  request: CreateUserRequest
): Promise<UseCaseResponse<User>> => {
  const user = await prisma.user.create({ data: request }); // Direct dependency
  // Use Case invaded infrastructure layer
};
```

**Treaty**: Dependency Inversion Principle - depend on abstractions, not concretions.

---

### 4. Clear Borders (Interface Contracts)

**Definition**: Nations communicate through treaties (interfaces), not invasions.

**In Code**:
```typescript
// ✅ SOVEREIGN: Clear contract between layers
// Domain defines the treaty
export interface UserRepository {
  findById(id: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
}

// Infrastructure signs the treaty
export const userRepository: UserRepository = {
  findById: async (id) => {
    const prismaUser = await prisma.user.findUnique({ where: { id } });
    return prismaUser ? transformPrismaToUser(prismaUser) : null;
  },
  create: async (data) => {
    const prismaUser = await prisma.user.create({ data });
    return transformPrismaToUser(prismaUser);
  },
};

// ❌ INTERVENTIONIST: No contract, direct invasion
// Use Case directly calls Prisma (no interface)
const user = await prisma.user.findUnique({ where: { id } }); // 🚨 NO TREATY
```

**Treaty**: Interfaces define borders. Implementations respect them.

---

### 5. Trade Agreements (Data Flow)

**Definition**: Layers trade data through defined protocols, not smuggling.

**In Code**:
```typescript
// ✅ SOVEREIGN: Clean data flow through layers
API Route → Use Case → Repository → Database
    ↓
Request DTO → Domain Entity → Database Model
    ↓
Response DTO ← Domain Entity ← Database Model

// Each layer transforms data at its border
// - API Route: HTTP Request → Request DTO
// - Use Case: Request DTO → Domain Entity
// - Repository: Domain Entity → Database Model

// ❌ INTERVENTIONIST: Data smuggling across layers
API Route → Database (skipping Use Case + Repository) // 🚨 SMUGGLING
Component → API directly (skipping Redux + Service)   // 🚨 SMUGGLING
```

**Treaty**: Each layer transforms data at its border checkpoint.

---

### 6. Secure Trade Without Seizures (Data Integrity)

**Definition**: Data is the most precious global commodity. In peace, trade flows freely, fairly, and securely. In war, trade becomes expensive, corrupt, and accessible only to the powerful.

**The Analogy**:
```
World at Peace (Sovereign Data):
- Request what you need → Receive exactly that (no tricks, no excess)
- Fair contracts (no advantageous terms for one party)
- Sanitized, validated data (quality control at borders)
- Performance optimized (free trade routes)
- Everyone can access (democratic access)

World at War (Coupled Data):
- Request User → Receive User + Orders + Addresses + ... (data seizure)
- Unfair contracts (tight coupling = vendor lock-in)
- Unsanitized data (security vulnerabilities)
- Performance degraded (expensive trade routes, N+1 queries)
- Only privileged can access (monolithic gatekeepers)
```

**In Code**:

```typescript
// ✅ SOVEREIGN: Fair data trade (request what you need, get what you need)
// API Contract: Get user profile
export interface GetUserProfileResponse {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export const executeGetUserProfile = async (
  userId: string,
  userRepository: UserRepository
): Promise<UseCaseResponse<GetUserProfileResponse>> => {
  const user = await userRepository.findById(userId);

  // Return ONLY what was requested (no seizures, no excess)
  return {
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      // NO orders, NO addresses, NO payment methods
      // Fair trade: request profile → receive profile
    },
  };
};

// ❌ INTERVENTIONIST: Data seizure (request user, receive entire graph)
export const executeGetUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      orders: true,           // 🚨 SEIZURE (not requested)
      addresses: true,        // 🚨 SEIZURE (performance cost)
      paymentMethods: true,   // 🚨 SEIZURE (security risk)
      wishlist: true,         // 🚨 SEIZURE (unnecessary data)
      reviews: true,          // 🚨 SEIZURE (bloated response)
    },
  });

  return user; // Returns 10MB when user asked for 1KB
};
```

**Data Sanitization (Quality Control at Borders)**:

```typescript
// ✅ SOVEREIGN: Sanitized data at layer boundary
export const userRepository: UserRepository = {
  findById: async (id: string): Promise<User | null> => {
    const prismaUser = await prisma.user.findUnique({ where: { id } });

    if (!prismaUser) return null;

    // SANITIZE at border (Prisma → Domain)
    return {
      id: prismaUser.id,
      email: sanitizeEmail(prismaUser.email),      // Remove whitespace, lowercase
      name: sanitizeString(prismaUser.name),       // XSS protection
      role: validateRole(prismaUser.role),         // Ensure valid enum
      createdAt: new Date(prismaUser.createdAt),   // Ensure Date object
      // NO passwordHash (security control)
      // NO internal fields (separation of concerns)
    };
  },
};

// ❌ INTERVENTIONIST: Unsanitized data flows freely
export const userRepository: UserRepository = {
  findById: async (id: string) => {
    return await prisma.user.findUnique({ where: { id } }); // 🚨 Raw Prisma object leaked
    // Contains: passwordHash, internalNotes, deletedAt, etc.
    // Security risk, data corruption, architectural violation
  },
};
```

**Performance (Free Trade Routes)**:

```typescript
// ✅ SOVEREIGN: Optimized data fetching (free trade)
export const executeGetOrdersWithCustomers = async (
  filters: OrderFilters,
  orderRepository: OrderRepository
): Promise<UseCaseResponse<Order[]>> => {
  // Repository optimizes query (single JOIN, no N+1)
  const orders = await orderRepository.findAllWithCustomers(filters);

  return { success: true, data: orders };
  // Fast, efficient, single query
};

// Implementation in repository
export const orderRepository: OrderRepository = {
  findAllWithCustomers: async (filters: OrderFilters) => {
    return prisma.order.findMany({
      where: buildWhere(filters),
      include: { customer: true }, // Optimized JOIN
    });
  },
};

// ❌ INTERVENTIONIST: N+1 problem (expensive, corrupt trade)
export const executeGetOrdersWithCustomers = async (filters: OrderFilters) => {
  const orders = await prisma.order.findMany({ where: buildWhere(filters) });

  // 🚨 N+1 PROBLEM: One query per order to get customer
  for (const order of orders) {
    order.customer = await prisma.customer.findUnique({
      where: { id: order.customerId },
    });
  }

  return orders;
  // 100 orders = 101 queries (1 + 100)
  // War economy: expensive, slow, resource-draining
};
```

**Democratic Access (No Gatekeepers)**:

```typescript
// ✅ SOVEREIGN: Interfaces enable democratic access
// Any implementation can satisfy the contract
export interface EmailService {
  send(to: string, subject: string, body: string): Promise<void>;
}

// Can use Sendgrid
export const sendgridEmailService: EmailService = { /* ... */ };

// Can use AWS SES
export const awsSESEmailService: EmailService = { /* ... */ };

// Can use mock for testing
export const mockEmailService: EmailService = { /* ... */ };

// Use Case doesn't care which implementation (democratic)
export const executeWelcomeUser = async (
  user: User,
  emailService: EmailService // Any implementation works
) => {
  await emailService.send(user.email, 'Welcome', 'Thanks!');
};

// ❌ INTERVENTIONIST: Vendor lock-in (monolithic gatekeeper)
import { sendgrid } from '@sendgrid/mail'; // 🚨 HARD DEPENDENCY

export const executeWelcomeUser = async (user: User) => {
  await sendgrid.send({
    to: user.email,
    subject: 'Welcome',
    text: 'Thanks!',
  });
  // Locked to Sendgrid, can't test, can't migrate
  // Monolithic gatekeeper controls trade
};
```

**The Consequences of War (Data Corruption)**:

```
Performance Degradation:
- N+1 queries instead of JOINs
- Over-fetching (100MB when needed 1MB)
- Circular dependencies (infinite loops)

Security Vulnerabilities:
- Unsanitized data (XSS, SQL injection)
- Leaked internal fields (passwordHash exposed)
- No validation (corrupt data enters system)

Accessibility Issues:
- Vendor lock-in (can't migrate)
- Tight coupling (can't test)
- Monolithic gatekeepers (only privileged can access)
```

**Treaty**:
- Request what you need → Receive exactly that (no seizures)
- Sanitize at borders (quality control)
- Optimize queries (free trade routes)
- Use interfaces (democratic access)
- Fair contracts (no vendor lock-in)

**Data is the most precious commodity** - protect its integrity, accessibility, and flow.

---

## Mapping to Clean Architecture

### The Sovereignty Map

```
┌─────────────────────────────────────────────────────────┐
│                     SOVEREIGN NATIONS                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Domain (Inner Circle)                                   │
│      Sovereignty: ABSOLUTE                               │
│      Dependencies: ZERO external                         │
│      Exports: Entities, Interfaces, Business Rules       │
│      Territory: Pure business logic                      │
│                                                          │
│  Application (Use Cases)                                 │
│      Sovereignty: HIGH                                   │
│      Dependencies: Domain interfaces only                │
│      Exports: Use Case operations                        │
│      Territory: Orchestration, validation, auth          │
│                                                          │
│  Infrastructure                                            │
│      Sovereignty: MEDIUM                                 │
│      Dependencies: Domain interfaces, external libs      │
│      Exports: Repository implementations, services       │
│      Territory: Database, HTTP, external systems         │
│                                                          │
│  🎨  Presentation                                        │
│      Sovereignty: MEDIUM                                 │
│      Dependencies: Application (Use Cases), Redux        │
│      Exports: UI components, screens                     │
│      Territory: User interaction, rendering              │
│                                                          │
│  📡  Framework (Next.js, React)                         │
│      Sovereignty: LOW (controlled by external power)     │
│      Dependencies: ALL layers (integration point)        │
│      Exports: Routes, pages, app config                  │
│      Territory: Routing, middleware, build               │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Dependency Rule**: Outer circles depend on inner circles. NEVER reverse.

---

## Violations (Acts of War)

### Common Invasions

#### 1. UI Invading Business Logic

```typescript
// ❌ INVASION: Component contains business rules
export const CheckoutButton = ({ cart }: Props) => {
  const handleCheckout = () => {
    // 🚨 Business logic in UI
    const total = cart.items.reduce((sum, item) => {
      const discount = item.quantity > 5 ? 0.1 : 0;
      return sum + (item.price * item.quantity * (1 - discount));
    }, 0);

    if (total > 1000) {
      applyVIPDiscount(); // 🚨 Business rule
    }
  };
};

// ✅ SOVEREIGNTY RESPECTED: Component delegates to Use Case
export const CheckoutButton = ({ cart }: Props) => {
  const dispatch = useDispatch();

  const handleCheckout = () => {
    dispatch(processCheckout(cart.id)); // Use Case handles business logic
  };
};
```

---

#### 2. Business Logic Invading Infrastructure

```typescript
// ❌ INVASION: Use Case directly uses database
export const executeCreateOrder = async (request: CreateOrderRequest) => {
  // 🚨 Use Case invaded infrastructure
  const order = await prisma.order.create({
    data: {
      userId: request.userId,
      items: { create: request.items },
    },
  });

  return { success: true, data: order };
};

// ✅ SOVEREIGNTY RESPECTED: Use Case uses repository interface
export const executeCreateOrder = async (
  request: CreateOrderRequest,
  orderRepository: OrderRepository
) => {
  const order = await orderRepository.create(request); // Interface, not implementation
  return { success: true, data: order };
};
```

---

#### 3. Circular Dependencies (Mutual Invasion)

```typescript
// ❌ MUTUAL INVASION: Countries invading each other
// userService.ts
import { orderService } from './orderService';
export const getUserOrders = (userId: string) => orderService.getByUser(userId);

// orderService.ts
import { userService } from './userService'; // 🚨 CIRCULAR
export const getOrderUser = (orderId: string) => userService.getById(orderId);

// ✅ SOVEREIGNTY RESPECTED: Third party mediates (Use Case)
// userOrdersUseCase.ts
export const executeGetUserOrders = (userId: string, orderRepo: OrderRepository) => {
  return orderRepo.findByUserId(userId); // No circular dependency
};
```

---

## Benefits of Sovereignty

### 1. Localized Changes

**War scenario** (coupled):
```
Change in database schema → breaks repositories
                          → breaks use cases
                          → breaks services
                          → breaks components
                          → breaks tests
                          → deployment blocked
```

**Peace scenario** (sovereign):
```
Change in database schema → update repository implementation ONLY
                          → all other layers unaffected (they depend on interface)
                          → tests pass
                          → deployment proceeds
```

---

### 2. Independent Testing

**War scenario**:
```typescript
// Can't test component without entire system running
test('renders checkout button', () => {
  render(<CheckoutButton />); // Needs Redux, API, Database running
});
```

**Peace scenario**:
```typescript
// Component sovereign, tests in isolation
test('renders checkout button', () => {
  const mockCart = { items: [] };
  render(<CheckoutButton cart={mockCart} />); // No dependencies
});
```

---

### 3. Technology Migration

**War scenario**:
```
Migrate Prisma → Drizzle = rewrite entire app (domain invaded by Prisma types)
```

**Peace scenario**:
```
Migrate Prisma → Drizzle = update repository implementations ONLY
                         = domain unchanged (depends on interfaces)
```

---

### 4. Team Scalability

**War scenario**:
```
Dev A changes database → breaks Dev B's UI
Dev B changes UI → requires Dev C's API changes
Constant merge conflicts, coordination overhead
```

**Peace scenario**:
```
Dev A: Works on repositories (infrastructure sovereignty)
Dev B: Works on components (presentation sovereignty)
Dev C: Works on use cases (application sovereignty)
Zero conflicts, parallel work, clear boundaries
```

---

## Sovereignty Treaty (Checklist)

### Before Merging Code

- [ ] **No layer imports from outer layers** (dependency rule)
- [ ] **Domain has ZERO external dependencies** (absolute sovereignty)
- [ ] **Use Cases depend on interfaces, not implementations** (non-intervention)
- [ ] **Components don't contain business logic** (territorial integrity)
- [ ] **Each module self-sufficient within its domain** (self-sufficiency)
- [ ] **Clear interfaces define all borders** (clear borders)
- [ ] **No circular dependencies** (mutual respect)
- [ ] **Data transforms at layer boundaries** (trade agreements)
- [ ] **Return ONLY requested data** (no seizures, no excess data)
- [ ] **Sanitize data at borders** (quality control, XSS/SQL injection protection)
- [ ] **Optimize queries** (no N+1, free trade routes)
- [ ] **Use interfaces for external dependencies** (democratic access, no vendor lock-in)

### Code Review Questions

1. **"Can I change the database without touching domain?"** → YES = Sovereign
2. **"Can I test this without external dependencies?"** → YES = Sovereign
3. **"Can I migrate this to another framework?"** → YES = Sovereign
4. **"Do dependencies point inward?"** → YES = Sovereign

---

## ESLint as Governance (Law Enforcement)

### The Analogy: Laws, Police, and Courts

In a sovereign nation, **documentation** is the constitution (philosophy, standards), but without **enforcement**, laws are just paper.

```
┌─────────────────────────────────────────────────────────────┐
│                    SOVEREIGNTY ENFORCEMENT                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  📜 Constitution (Standards & Patterns)                      │
│     - Standards: WHAT rules exist and WHY                    │
│     - Patterns: HOW to implement correctly                   │
│     - Documentation: The written law                         │
│                                                               │
│  👮 Police (ESLint Custom Rules)                             │
│     - Detects violations in real-time                        │
│     - Prevents illegal actions (code that breaks rules)      │
│     - Issues warnings/errors (citations)                     │
│     - Suggests corrections (rehabilitation)                  │
│                                                               │
│  Courts (CI/CD Pipeline)                                      │
│     - Final judgment (build pass/fail)                       │
│     - Zero tolerance (0 errors required)                     │
│     - Appeals process (eslint-disable with justification)    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Custom ESLint Rules as Law Enforcement

**Philosophy without enforcement = chaos.** Custom ESLint rules are the police force that ensures sovereignty is respected:

| Rule | Principle Enforced | Violation |
|------|-------------------|-----------|
| `no-cross-context-imports` | Territorial Integrity | admin ↔ public imports |
| `no-cross-layer-imports` | Non-Intervention | UI calling database |
| `no-direct-service-calls` | Trade Agreements | Component calling API directly |
| `no-hardcoded-colors` | Clear Borders | Magic colors (use colorsFlatMap) |
| `no-hardcoded-spacing` | Clear Borders | Magic numbers (use spacingFlatMap) |
| `no-inline-types` | Self-Sufficiency | Types scattered in implementation |
| `enforce-use-case-pattern` | Territorial Integrity | Business logic in routes |
| `no-native-html` | Trade Agreements | Raw HTML (use styled-components) |

### Example: Governance in Action

```typescript
// ❌ VIOLATION DETECTED by no-cross-layer-imports
// src/apps/admin/presentation/screens/UserScreen.tsx
import { prisma } from '@libs/infrastructure/database'; // 🚨 ESLint Error!
// "Cross-layer import detected. Presentation cannot import from infrastructure directly."

// ✅ COMPLIANT
import { useUsers } from '../hooks/useUsers'; // Goes through proper channels

// ❌ VIOLATION DETECTED by no-hardcoded-spacing
padding: 24px; // 🚨 ESLint Warning!
// "Hardcoded spacing detected. Use spacingFlatMap[md] from @constants."

// ✅ COMPLIANT
padding: ${spacingFlatMap.md};
```

### Governance Structure

```
Standards (Law)           → Define what's legal
Patterns (Procedures)     → Define how to comply
ESLint Rules (Police)     → Detect violations in real-time
CI Pipeline (Courts)      → Final judgment (0 errors required)
eslint-disable (Appeals)  → Exceptions with justification (rare)
```

### Why Governance Matters

**Without ESLint enforcement:**
- Developer writes invasive code
- Works locally
- Merges to main
- Breaks sovereignty
- Technical debt accumulates
- Architecture erodes

**With ESLint enforcement:**
- Developer writes invasive code
- ESLint flags error immediately
- Cannot commit (husky hooks)
- Must fix or justify (eslint-disable with comment)
- Sovereignty maintained
- Architecture preserved

### Creating New Laws (Custom Rules)

When a new sovereignty principle needs enforcement:

```javascript
// scripts/eslint-rules/no-sovereignty-violation.js
export const noSovereigntyViolationRule = {
  meta: {
    type: 'problem',
    docs: { description: 'Enforces sovereignty principle X' },
    messages: {
      violation: 'Sovereignty violated: {{reason}}. Use {{suggestion}} instead.',
    },
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        // Detect violation, report with helpful message
        if (isViolation(node)) {
          context.report({
            node,
            messageId: 'violation',
            data: { reason: '...', suggestion: '...' },
          });
        }
      },
    };
  },
};
```

### ESLint as the Great Equalizer

ESLint ensures:
1. **Consistency**: All developers follow same rules
2. **Education**: Error messages teach sovereignty principles
3. **Prevention**: Violations caught BEFORE merge
4. **Documentation**: Rules ARE documentation (self-enforcing)
5. **Democracy**: Rules apply equally to everyone

> "A nation without laws is anarchy. Code without linting is chaos."

---

## Implementation Roadmap

### Establishing Sovereignty

**Step 1: Define Borders** (interfaces)
```typescript
// Domain defines what it needs, not how
export interface EmailService {
  send(to: string, subject: string, body: string): Promise<void>;
}
```

**Step 2: Sign Treaties** (dependency injection)
```typescript
// Use Case receives interface, not implementation
export const executeWelcomeUser = async (
  user: User,
  emailService: EmailService // Treaty signed
) => {
  await emailService.send(user.email, 'Welcome', 'Thanks for joining!');
};
```

**Step 3: Implement Sovereignty** (layer implements interface)
```typescript
// Infrastructure implements treaty
export const sendgridEmailService: EmailService = {
  send: async (to, subject, body) => {
    await sendgridClient.send({ to, subject, body }); // Implementation detail
  },
};
```

**Step 4: Respect Borders** (no invasions)
```typescript
// ✅ Use Case doesn't know about Sendgrid (sovereignty respected)
// ❌ Use Case importing Sendgrid directly (invasion)
```

---

## Real-World Example: Reference Project

### Sovereign Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    PROJECT SOVEREIGNTY                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Domain (Business Rules)                                │
│    - Event, Challenge, Evidence entities                │
│    - Validation rules (pure functions)                  │
│    - ZERO dependencies on Prisma, Next.js, React        │
│    - Sovereignty: ABSOLUTE                               │
│                                                          │
│  Application (Use Cases)                                │
│    - executeCreateEvent, executeSubmitEvidence          │
│    - Depends on domain interfaces ONLY                  │
│    - Sovereignty: HIGH                                   │
│                                                          │
│  Infrastructure                                         │
│    - Repositories (Prisma/Mocks)                        │
│    - Services (Stripe, Cloudinary)                      │
│    - Implements domain interfaces                        │
│    - Sovereignty: MEDIUM                                 │
│                                                          │
│  Presentation                                           │
│    - Components (EventCard, ChallengeList)              │
│    - Screens (DashboardScreen, EvidenceScreen)          │
│    - Redux state management                              │
│    - Sovereignty: MEDIUM                                 │
│                                                          │
│  Framework (Next.js 15)                                 │
│    - API routes (thin controllers)                      │
│    - App Router pages (delegation only)                 │
│    - Sovereignty: LOW                                    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Migration Example (Mock → Prisma)

**Because sovereignty was respected**:
```typescript
// Step 1: Domain unchanged (no Prisma types leaked)
export interface User {
  id: string;
  email: string;
  role: UserRole;
}

// Step 2: Use Cases unchanged (depend on interface)
export const executeGetUsers = async (
  filters: UserFilters,
  userRepository: UserRepository // Interface, not implementation
) => {
  return userRepository.findAll(filters);
};

// Step 3: ONLY repository implementation changed
// Before (Mock)
export const userRepository: UserRepository = {
  findAll: async (filters) => mockUsers.filter(/* ... */),
};

// After (Prisma)
export const userRepository: UserRepository = {
  findAll: async (filters) => {
    const users = await prisma.user.findMany({ where: buildWhere(filters) });
    return users.map(transformPrismaToUser);
  },
};
```

**Result**: Migration completed WITHOUT touching domain or use cases. Sovereignty enabled this.

---

## Further Reading

**Foundational Concepts**:
- Clean Architecture (Robert C. Martin)
- SOLID Principles
- Domain-Driven Design (Eric Evans)
- Hexagonal Architecture (Alistair Cockburn)

**Reference Patterns**:
- `.claude/patterns/use-case-patterns.md` - Application sovereignty
- `.claude/patterns/repository-patterns.md` - Infrastructure sovereignty
- `.claude/patterns/component-structure.md` - Presentation sovereignty
- `.claude/patterns/entity-patterns.md` - Domain sovereignty

**Reference Standards**:
- `.claude/patterns/core/ARCHITECTURE-STANDARDS.md` - Layer boundaries
- `.claude/patterns/core/USE-CASES-STANDARDS.md` - Business logic sovereignty
- `.claude/patterns/core/DOMAIN-OBJECTS-STANDARDS.md` - Entity sovereignty

---

## Philosophical Note

**Why "Sovereignty" over "Separation of Concerns"?**

"Separation of Concerns" is technical jargon.

"Sovereignty" is a human concept everyone understands:
- Respect borders
- No invasions
- Trade agreements
- Self-sufficiency
- Clear territories

When you explain to a new developer:
- ❌ "We follow the Dependency Inversion Principle"
- ✅ "Each layer has sovereignty - don't invade other territories"

The second resonates immediately.

---

**Version**: 1.1
**Author**: Roberto Ramirez
**Date**: 2025-12-20
**Status**: Production-validated
**Scope**: Universal (applicable to all Clean Architecture projects)

---

> "In software, as in geopolitics, lasting peace comes from respecting sovereignty, not from forced integration." - Code Sovereignty Principle
>
> "Data is the most precious global commodity. Protect its integrity, accessibility, and flow." - Secure Trade Principle
