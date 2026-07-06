# Hierarchical RBAC Patterns

> **PURPOSE**: Universal patterns for role-based access control with hierarchy
> **SCOPE**: Role levels, permission matrices, authorization patterns
> **STATUS**: Global agnostic pattern
> **UPDATED**: 2025-12-22

---

## Core Concept: Role Hierarchy

Hierarchical RBAC assigns numeric levels to roles. Higher levels inherit lower level permissions.

```typescript
// Generic role hierarchy definition
interface RoleDefinition {
  name: string;
  level: number;  // Higher = more permissions
  scope: 'platform' | 'tenant' | 'resource';
  description: string;
}

// Example hierarchy (customize per project)
const ROLE_HIERARCHY: Record<string, RoleDefinition> = {
  SUPER_ADMIN: {
    name: 'Super Administrator',
    level: 100,
    scope: 'platform',
    description: 'Platform owner with full access'
  },
  ADMIN: {
    name: 'Administrator',
    level: 80,
    scope: 'platform',
    description: 'Platform admins with cross-tenant access'
  },
  TENANT_OWNER: {
    name: 'Tenant Owner',
    level: 60,
    scope: 'tenant',
    description: 'Tenant owner with full tenant access'
  },
  TENANT_ADMIN: {
    name: 'Tenant Admin',
    level: 40,
    scope: 'tenant',
    description: 'Tenant admin with limited permissions'
  },
  MEMBER: {
    name: 'Member',
    level: 20,
    scope: 'resource',
    description: 'Basic member with assigned resources'
  },
  VIEWER: {
    name: 'Viewer',
    level: 10,
    scope: 'resource',
    description: 'Read-only access'
  }
};

type UserRole = keyof typeof ROLE_HIERARCHY;
```

---

## Pattern 1: Role Level Comparison

```typescript
// Check if user has minimum role level
const hasMinimumRole = (userRole: UserRole, minimumRole: UserRole): boolean => {
  return ROLE_HIERARCHY[userRole].level >= ROLE_HIERARCHY[minimumRole].level;
};

// Check if user has any of the allowed roles
const hasAnyRole = (userRole: UserRole, allowedRoles: UserRole[]): boolean => {
  return allowedRoles.includes(userRole);
};

// Check if user has higher role than target
const hasHigherRole = (userRole: UserRole, targetRole: UserRole): boolean => {
  return ROLE_HIERARCHY[userRole].level > ROLE_HIERARCHY[targetRole].level;
};

// Usage
if (hasMinimumRole(user.role, 'ADMIN')) {
  // Allow admin-level actions
}

if (hasHigherRole(currentUser.role, targetUser.role)) {
  // Can modify target user
}
```

---

## Pattern 2: Permission Matrix

```typescript
// Define permissions per role
type Permission =
  | 'users:read' | 'users:write' | 'users:delete'
  | 'resources:read' | 'resources:write' | 'resources:delete'
  | 'settings:read' | 'settings:write'
  | 'billing:read' | 'billing:write';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: ['*'],  // All permissions

  ADMIN: [
    'users:read', 'users:write', 'users:delete',
    'resources:read', 'resources:write',
    'settings:read', 'settings:write'
  ],

  TENANT_OWNER: [
    'users:read', 'users:write',
    'resources:read', 'resources:write', 'resources:delete',
    'settings:read', 'settings:write',
    'billing:read', 'billing:write'
  ],

  TENANT_ADMIN: [
    'users:read',
    'resources:read', 'resources:write',
    'settings:read'
  ],

  MEMBER: [
    'resources:read', 'resources:write'
  ],

  VIEWER: [
    'resources:read'
  ]
};

// Check permission
const hasPermission = (userRole: UserRole, permission: Permission): boolean => {
  const permissions = ROLE_PERMISSIONS[userRole];
  return permissions.includes('*') || permissions.includes(permission);
};
```

---

## Pattern 3: Authorization Function

```typescript
interface AuthResult {
  success: boolean;
  user?: AuthenticatedUser;
  error?: string;
  status?: number;
}

interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  tenantId?: string;  // For tenant-scoped users
}

// Central authorization function
const validateAndGetUser = async (
  request: Request,
  allowedRoles: UserRole[]
): Promise<AuthResult> => {
  // 1. Extract token
  const token = extractToken(request);
  if (!token) {
    return {
      success: false,
      error: 'Authentication required',
      status: 401
    };
  }

  // 2. Verify token
  const decoded = await verifyToken(token);
  if (!decoded) {
    return {
      success: false,
      error: 'Session expired',
      status: 401
    };
  }

  // 3. Check role
  if (!allowedRoles.includes(decoded.role)) {
    return {
      success: false,
      error: 'Insufficient permissions',
      status: 403
    };
  }

  // 4. Get fresh user data
  const user = await userRepository.findById(decoded.userId);
  if (!user || !user.isActive) {
    return {
      success: false,
      error: 'User not found or inactive',
      status: 403
    };
  }

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId
    }
  };
};
```

---

## Pattern 4: Use Case Authorization

```typescript
// Generic authorized use case wrapper
const executeAuthorizedOperation = async <TParams, TResult>(
  params: TParams & { request: Request },
  allowedRoles: UserRole[],
  operation: (user: AuthenticatedUser, params: TParams) => Promise<TResult>
): Promise<TResult | ErrorResult> => {
  const authResult = await validateAndGetUser(params.request, allowedRoles);

  if (!authResult.success) {
    return createError(authResult.error!, authResult.status!);
  }

  return operation(authResult.user!, params);
};

// Usage in use case
const executeCreateResource = async (params: CreateResourceParams) => {
  return executeAuthorizedOperation(
    params,
    ['ADMIN', 'TENANT_OWNER', 'TENANT_ADMIN'],
    async (user, params) => {
      // User is verified, proceed with operation
      return resourceRepository.create({
        ...params.data,
        tenantId: user.tenantId,
        createdBy: user.id
      });
    }
  );
};
```

---

## Pattern 5: Granular Resource Permissions

```typescript
// For fine-grained access beyond roles
interface ResourcePermission {
  id: string;
  userId: string;
  resourceId: string;
  resourceType: string;
  permissions: {
    canRead: boolean;
    canWrite: boolean;
    canDelete: boolean;
    canShare: boolean;
  };
}

// Check resource-level permission
const checkResourcePermission = async (
  userId: string,
  resourceId: string,
  permission: keyof ResourcePermission['permissions']
): Promise<boolean> => {
  const grant = await permissionRepository.findByUserAndResource(
    userId,
    resourceId
  );

  if (!grant) return false;
  return grant.permissions[permission];
};

// Combined role + resource check
const canAccessResource = async (
  user: AuthenticatedUser,
  resourceId: string,
  action: 'read' | 'write' | 'delete'
): Promise<boolean> => {
  // Platform admins bypass resource permissions
  if (hasMinimumRole(user.role, 'ADMIN')) {
    return true;
  }

  // Tenant owners can access all tenant resources
  if (user.role === 'TENANT_OWNER') {
    const resource = await resourceRepository.findById(resourceId);
    return resource?.tenantId === user.tenantId;
  }

  // Others need explicit permission
  return checkResourcePermission(user.id, resourceId, `can${capitalize(action)}`);
};
```

---

## Pattern 6: Role Scope Boundaries

```typescript
// Define what each scope can access
const SCOPE_BOUNDARIES = {
  platform: {
    canAccessAllTenants: true,
    canAccessPlatformSettings: true,
    requiresTenantContext: false
  },
  tenant: {
    canAccessAllTenants: false,
    canAccessPlatformSettings: false,
    requiresTenantContext: true
  },
  resource: {
    canAccessAllTenants: false,
    canAccessPlatformSettings: false,
    requiresTenantContext: true,
    requiresResourceAssignment: true
  }
};

// Apply scope boundary
const applyRoleScope = (user: AuthenticatedUser) => {
  const roleConfig = ROLE_HIERARCHY[user.role];
  const boundaries = SCOPE_BOUNDARIES[roleConfig.scope];

  return {
    ...boundaries,
    tenantId: boundaries.requiresTenantContext ? user.tenantId : null
  };
};
```

---

## Pattern 7: Middleware Integration

```typescript
// Route middleware for role checking
const withAuth = (allowedRoles: UserRole[]) => {
  return async (request: Request) => {
    const authResult = await validateAndGetUser(request, allowedRoles);

    if (!authResult.success) {
      return new Response(authResult.error, { status: authResult.status });
    }

    // Attach user to request context
    return { user: authResult.user };
  };
};

// Usage in API routes
export async function POST(request: Request) {
  const auth = await withAuth(['ADMIN', 'TENANT_OWNER'])(request);
  if (auth instanceof Response) return auth;

  // auth.user is available
  return executeOperation(auth.user, await request.json());
}
```

---

## Anti-Patterns (NEVER DO)

```typescript
// Role check in wrong place (component instead of use case)
const Component = () => {
  if (user.role !== 'ADMIN') {
    return null;  // Client-side only = INSECURE
  }
};

// Hardcoded role strings
if (user.role === 'admin') {}  // Use constants

// Missing role check
const executeOperation = async (params) => {
  // Directly execute without auth check
  return repository.create(params);
};

// Role from request body
const { role } = await request.json();  // NEVER trust client
```

---

## Checklist

- [ ] Role hierarchy defined with levels
- [ ] Permission matrix per role
- [ ] validateAndGetUser() in all use cases
- [ ] Role scope boundaries enforced
- [ ] Resource-level permissions (if needed)
- [ ] Middleware for API routes
- [ ] No client-side only role checks

---

## See also

**Patterns**:
- `saas-multi-tenant-patterns.md` - Tenant isolation
- `saas-tier-limiting-patterns.md` - Tier enforcement
- `middleware-patterns.md` - Auth middleware

**Standards**:
- `USE-CASES-STANDARDS.md` - Authorization in use cases
- `MIDDLEWARE-STANDARDS.md` - Route protection

---

**Lines**: ~320 | **Status**: Global agnostic pattern
