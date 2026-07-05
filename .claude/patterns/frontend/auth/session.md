# Auth Session Patterns

> **PURPOSE**: Single source of truth for authentication state
> **SCOPE**: All client-side authentication in React/Next.js applications
> **VERSION**: 1.0

---

## Overview

Authentication requires a single source of truth to prevent state inconsistencies. Multiple auth sources (localStorage, cookies, Redux, Context) lead to race conditions, stale state, and UI flashes.

**Anti-pattern**: Reading auth from multiple sources
```typescript
// ❌ WRONG - Multiple sources cause inconsistency
const isAuthFromRedux = useSelector(selectIsAuthenticated);
const isAuthFromCookie = document.cookie.includes('auth-token');
const isAuthFromStorage = Boolean(localStorage.getItem('auth_token'));
```

**Pattern**: Single AuthProvider as source of truth
```typescript
// ✅ CORRECT - Single source via useAuth hook
const { isAuthenticated, user, isLoading } = useAuth();
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    AuthProvider (Context)                        │
│                   SINGLE SOURCE OF TRUTH                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────┐    ┌──────────────┐    ┌─────────────────┐   │
│   │ localStorage │←──│ AuthProvider │──→│ Cookie (API)     │   │
│   │ (auth_token) │    │   (Context)  │    │ (auth-token)    │   │
│   └─────────────┘    └──────┬───────┘    └─────────────────┘   │
│                             │                                   │
│                             │ dispatch                          │
│                             ↓                                   │
│                      ┌──────────────┐                           │
│                      │ Redux State  │ (legacy sync)             │
│                      └──────────────┘                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

Components read from: useAuth() hook only
```

---

## File Structure

```
src/libs/presentation/providers/AuthProvider/
├── AuthProvider.tsx           # Context provider implementation
├── AuthProvider.interfaces.ts # TypeScript interfaces
├── AuthProvider.constants.ts  # Token keys, cookie config
└── index.ts                   # Barrel exports

src/libs/presentation/hooks/useAuth/
├── useAuth.tsx                # Hook that reads from AuthContext
├── useAuth.interfaces.ts      # Return type interface
└── index.ts                   # Barrel exports
```

---

## Implementation

### AuthProvider.constants.ts

```typescript
/**
 * AuthProvider Constants
 */
export const AUTH_TOKEN_KEY = 'auth_token';
export const AUTH_COOKIE_NAME = 'auth-token';
/** Cookie max age: 7 days in seconds */
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
```

### AuthProvider.interfaces.ts

```typescript
import type { AuthUser } from '@redux/slices/auth/auth.slice.interfaces';

export interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  userId: string | null;
  login: (email: string, password: string) => Promise<AuthUser | undefined>;
  logout: () => Promise<void>;
  refreshAuth: () => void;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
```

### AuthUser Interface (agnostic core)

The pattern's `AuthUser` contains ONLY auth-essential fields. Domain profile fields (address,
phone, age, etc.) belong to the project — extend `AuthUser` in your project's domain layer.

```typescript
/**
 * Auth user — agnostic core from JWT token.
 * Contains only fields needed for authentication and authorization.
 * Project-specific profile fields live in a project-extended interface.
 */
export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  photoUrl: string | null;
  isActive: boolean;
}
```

### Extending AuthUser in your project

When your project needs richer profile data, extend the agnostic core in your own domain layer.
This keeps the pattern reusable across projects with different profile shapes.

```typescript
/**
 * src/libs/domain/entities/auth/auth-user.entity.ts
 *
 * Project-specific extension of the agnostic AuthUser.
 * Add only fields your project actually consumes from the JWT or profile API.
 */
import type { AuthUser } from '@dannydanzka/sovereignty-ui'; // or wherever your project imports it from

export interface ProjectAuthUser extends AuthUser {
  phone: string | null;
  street: string | null;
  city: string | null;
  // ... your domain fields here
}
```

The JWT payload should mirror the agnostic `AuthUser` shape. Profile fields beyond the core
should be loaded separately (e.g. `GET /api/users/me`) so token size stays bounded.

### AuthProvider Core Logic

```typescript
/**
 * AuthProvider Component
 *
 * SINGLE SOURCE OF TRUTH for authentication state.
 *
 * Flow:
 * 1. On mount: Read token from localStorage, validate, decode user
 * 2. On login: Store token, sync cookie, update context
 * 3. On logout: Clear all (localStorage, cookie, Redux, context)
 */

'use client';

import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';

import type { AppDispatch } from '@redux/store/store.config';
import { AuthService } from '@services/auth';
import type { AuthUser } from '@redux/slices/auth/auth.slice.interfaces';
import { logError } from '@helpers';
import { resetAuthState } from '@redux/slices/auth';

import { AUTH_COOKIE_MAX_AGE, AUTH_COOKIE_NAME, AUTH_TOKEN_KEY } from './AuthProvider.constants';
import type { AuthContextValue, AuthProviderProps } from './AuthProvider.interfaces';

/**
 * Decode JWT payload without verification (client-side)
 */
const decodeToken = (token: string): { exp: number; userId: string } | null => {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const payload = JSON.parse(atob(parts[1] as string));
    return payload;
  } catch (error) {
    logError(error, 'AuthProvider.decodeToken');
    return null;
  }
};

/**
 * Check if token is valid and not expired
 */
const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  const payload = decodeToken(token);
  if (!payload?.exp || !payload?.userId) return false;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp > now;
};

/**
 * Get user from token payload
 */
const getUserFromToken = (token: string): AuthUser | null => {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const payload = JSON.parse(atob(parts[1] as string));
    if (!payload.userId || !payload.email) return null;

    return {
      age: payload.age ?? null,
      bio: payload.bio ?? null,
      city: payload.city ?? null,
      country: payload.country ?? null,
      email: payload.email,
      firstName: payload.firstName ?? '',
      id: payload.userId,
      isActive: payload.isActive ?? true,
      lastName: payload.lastName ?? '',
      neighborhood: payload.neighborhood ?? null,
      number: payload.number ?? null,
      phone: payload.phone ?? null,
      photoUrl: payload.photoUrl ?? null,
      role: payload.role ?? 'participant',
      state: payload.state ?? null,
      street: payload.street ?? null,
      zipCode: payload.zipCode ?? null,
    };
  } catch (error) {
    logError(error, 'AuthProvider.getUserFromToken');
    return null;
  }
};

const setCookie = (token: string): void => {
  if (typeof document === 'undefined') return;
  document.cookie = `${AUTH_COOKIE_NAME}=${token}; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; SameSite=Lax`;
};

const clearCookie = (): void => {
  if (typeof document === 'undefined') return;
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
};

const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

const storeToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

const clearToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);

  const initializeAuth = useCallback(() => {
    const token = getStoredToken();

    if (isTokenValid(token)) {
      const tokenUser = getUserFromToken(token as string);
      setIsAuthenticated(true);
      setUser(tokenUser);
      setCookie(token as string);
    } else {
      setIsAuthenticated(false);
      setUser(null);
      clearToken();
      clearCookie();
      dispatch(resetAuthState());
    }

    setIsLoading(false);
  }, [dispatch]);

  const refreshAuth = useCallback(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = useCallback(
    async (email: string, password: string): Promise<AuthUser | undefined> => {
      setIsLoading(true);

      try {
        const result = await AuthService.login({
          email: email.trim(),
          password,
        });

        if (result.token) {
          storeToken(result.token);
          setCookie(result.token);

          const tokenUser = getUserFromToken(result.token);

          setIsAuthenticated(true);
          setUser(tokenUser);
          setIsLoading(false);

          return tokenUser ?? undefined;
        }

        setIsLoading(false);
        return undefined;
      } catch (error) {
        logError(error, 'AuthProvider.login');
        setIsLoading(false);
        throw error;
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      logError(error, 'AuthProvider.logout');
    }

    clearToken();
    clearCookie();
    setIsAuthenticated(false);
    setUser(null);
    dispatch(resetAuthState());
    setIsLoading(false);

    router.push('/login');
  }, [dispatch, router]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const userId = user?.id ?? null;

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      isLoading,
      login,
      logout,
      refreshAuth,
      user,
      userId,
    }),
    [isAuthenticated, isLoading, login, logout, refreshAuth, user, userId]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

### useAuth Hook

```typescript
/**
 * useAuth Hook
 *
 * SINGLE ENTRY POINT for authentication state.
 * All components MUST use this hook, never Redux selectors directly.
 */

'use client';

import { useContext } from 'react';

import { AuthContext } from '@providers/AuthProvider';

import type { UseAuthReturn } from './useAuth.interfaces';

export const useAuth = (): UseAuthReturn => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return {
    isAuthenticated: context.isAuthenticated,
    isLoading: context.isLoading,
    login: context.login,
    logout: context.logout,
    user: context.user,
    userId: context.userId,
  };
};
```

---

## Integration with Provider Tree

```typescript
// ReduxProvider.tsx
export const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>{children}</AuthProvider>
      </PersistGate>
    </Provider>
  );
};
```

**Order matters**:
1. Redux Provider (store available)
2. PersistGate (hydration complete)
3. AuthProvider (auth state initialized from localStorage)

---

## Usage in Components

### Layout with Auth Check

```typescript
const PublicLayout = ({ children }: PublicLayoutProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while auth is being validated
  // Prevents flash between authenticated/unauthenticated layouts
  if (isLoading) {
    return (
      <Container>
        <MainContent>{children}</MainContent>
      </Container>
    );
  }

  if (isAuthenticated) {
    return (
      <AuthenticatedContainer>
        <Drawer />
        <MainContent>{children}</MainContent>
      </AuthenticatedContainer>
    );
  }

  return (
    <PublicContainer>
      <Header />
      <MainContent>{children}</MainContent>
    </PublicContainer>
  );
};
```

### Protected Screen

```typescript
const ProfileScreen = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return <LoadingState />;
  }

  return <ProfileContent user={user} />;
};
```

---

## DO

- Use `useAuth()` hook for ALL auth state reads
- Check `isLoading` before making auth decisions
- Handle loading state to prevent UI flash
- Wrap app with `AuthProvider` inside Redux provider
- Clear ALL auth sources on logout (token, cookie, Redux)
- Validate JWT expiration on initialization

## DON'T

- Use Redux `selectIsAuthenticated` in components
- Read from localStorage/cookies directly
- Skip the `isLoading` check in conditionals
- Create multiple auth state sources
- Cache auth state in component state
- Forget to sync cookie for API calls

---

## Migration Guide

### From Redux Auth to AuthProvider

**Before** (multiple sources):
```typescript
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@redux/selectors/auth';

const Component = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  // ...
};
```

**After** (single source):
```typescript
import { useAuth } from '@hooks/useAuth';

const Component = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Loading />;
  // ...
};
```

---

## ESLint Configuration

AuthProvider is infrastructure-level and requires direct service calls:

```javascript
// eslint.config.js
{
  files: ['src/libs/presentation/providers/AuthProvider/AuthProvider.tsx'],
  rules: {
    'custom/no-direct-service-calls': 'off',
  },
},
```

---

## Related Patterns

- `.claude/patterns/middleware-patterns.md` - Server-side auth validation
- `.claude/patterns/redux-patterns.md` - Redux state management
- `.claude/patterns/core/MIDDLEWARE-STANDARDS.md` - Auth middleware rules

---

**Version**: 1.0 | **Updated**: 2026-01-12
