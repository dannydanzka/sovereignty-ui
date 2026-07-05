# Testing Next.js App Router — Layer 3 (Stack)

> **Layer**: 3 (stack-specific)
> **Stack**: Next.js 13+ App Router (the `app/` directory)
> **Updated**: 2026-04-22

For runner config see `runners/jest.md` / `runners/vitest.md`. This doc covers what App Router specifically requires.

---

## The big shifts vs Pages Router

| Concern | Pages Router | App Router |
|---|---|---|
| Routing API | `next/router` (`useRouter().push`) | `next/navigation` (`useRouter`, `usePathname`, `useSearchParams`) |
| Component default | Client component | Server component (RSC) |
| Client opt-in | N/A | `'use client'` directive at file top |
| Data fetching | `getServerSideProps`, `getStaticProps` | Server components fetch directly; `fetch()` is cached |
| Layouts | `_app.tsx`, `_document.tsx` | Nested `layout.tsx` per route |

Tests almost exclusively cover **client components** with `@testing-library/react`. Server components require different tooling (see "Testing server components" below).

---

## Mocking `next/navigation`

The single most-needed mock. Without it, any client component using `useRouter()` crashes in test env.

```ts
// Default mock: covers most cases
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: mockBack,
    prefetch: jest.fn(),
    refresh: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => '/dashboard',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
  redirect: jest.fn(),
  notFound: jest.fn(),
}));
```

**Stable references** (see `test-doubles.md` and `anti-patterns.md`):

```ts
// ❌ New object every call → re-render storm → OOM
useRouter: () => ({ push: jest.fn() }),

// ✅ Stable
const router = { push: jest.fn(), replace: jest.fn(), back: jest.fn(), prefetch: jest.fn(), refresh: jest.fn(), forward: jest.fn() };
useRouter: () => router,
```

Centralize this in the project's setup file or `@test-helpers`, not per-test-file.

---

## `'use client'` directive

The directive is a **build-time** marker for the bundler. The test runner ignores it — components are imported normally regardless.

What it means for tests:

- Test runs the component as plain React. Server-only APIs (`headers()`, `cookies()`) are not available — don't import them in client components, the build catches it.
- If a "client" component imports a server-only utility (data-access layer, DB client), the test fails at import. Mock that boundary.

```ts
// app/dashboard/UserCard.tsx
'use client';
import { useUser } from '@/hooks/use-user';   // client-safe
import { db } from '@/lib/db';                // ❌ server-only, will crash in tests

export function UserCard() { /* ... */ }
```

Fix: don't import server-only modules from client components. The boundary is a real architectural rule, not a test-config workaround.

---

## App Router-specific helpers to mock

| Module | Why mock |
|---|---|
| `next/navigation` | Crashes without router context |
| `next/headers` | Server-only — should never appear in client component, mock if a shared util uses it |
| `next/image` | Optional — works in jsdom but logs warnings; mock to a plain `<img>` if noise is annoying |
| `next/link` | Usually works; mock only if you need to assert `href` without navigation side effects |
| `next/font/*` | Returns class names — mock to return a stable object |

```ts
// next/font example
jest.mock('next/font/google', () => ({
  Inter: () => ({ className: 'inter', style: { fontFamily: 'Inter' } }),
}));
```

---

## Server actions

Server actions are async functions exported from server components or marked with `'use server'`. From a client component perspective they're just async functions — mock them like any service:

```ts
// app/actions.ts
'use server';
export async function createPost(data: PostInput) { /* ... */ }

// In tests of a client component that calls createPost:
jest.mock('@/app/actions', () => ({
  createPost: jest.fn(),
}));

const mockCreate = jest.mocked(createPost);
mockCreate.mockResolvedValue({ id: '1', title: 'Hola' });
```

Don't try to test the server action itself with React Testing Library. It's a server function — test it like a regular async function (import, call, assert), or via E2E.

---

## Testing server components (limited)

There is no first-class RTL story for server components. Options:

1. **Don't.** Most logic in server components should be thin (fetch + render). Push complex logic to plain functions and unit-test those.
2. **Render via `renderToString`** for very simple cases — loses interactivity but proves the JSX renders without crashing.
3. **E2E** for the integration — see `qa/automation/playwright.md`.

If a server component is complex enough to warrant unit tests, it probably has business logic that should live in a non-component module.

---

## Route handlers (`app/**/route.ts`)

Pure async functions matching `(request: Request) => Response`. Test as plain functions:

```ts
// app/api/users/route.ts
export async function GET(request: Request) {
  const users = await fetchUsers();
  return Response.json(users);
}

// app/api/users/route.test.ts
import { GET } from './route';

it('returns users as JSON', async () => {
  const res = await GET(new Request('http://test/api/users'));
  expect(res.status).toBe(200);
  expect(await res.json()).toEqual(mockUsers);
});
```

Mock the data layer (`fetchUsers`), not the `Request`/`Response` globals (Node 18+ ships them).

---

## Page tests vs component tests

Test **components** (`components/UserCard.tsx`), not **pages** (`app/dashboard/page.tsx`):

- Pages are wiring (compose components, fetch data, set metadata). Cover via E2E.
- Components have logic worth unit-testing.

If a page has meaningful logic, extract it to a component or hook and test that. Keep `page.tsx` thin enough that "rendering it without crashing" is sufficient — and even that is better as an E2E smoke.

---

## Image and Link special cases

`next/image` in jsdom emits `<img>` with the priority/loader props. Most assertions work as-is:

```ts
const img = screen.getByRole('img', { name: 'Avatar' });
expect(img).toHaveAttribute('src', expect.stringContaining('/avatar.jpg'));
```

`next/link` renders an `<a>` with the `href` you passed. Click navigation in tests is mocked via the `next/navigation` mock above (`useRouter().push`).

---

## i18n with `next-intl` or similar

Mock the hook with a stable factory that echoes the key:

```ts
const stableT = (key: string) => key;
jest.mock('next-intl', () => ({
  useTranslations: () => stableT,
  useLocale: () => 'es',
}));
```

Tests then assert on the key (`expect(screen.getByText('login.title'))`), keeping them locale-independent. For locale-specific behavior (pluralization), import the real provider with a fixed message catalog.

---

## Common failures

| Symptom | Cause | Fix |
|---|---|---|
| `useRouter is not a function` | Missing `next/navigation` mock | Add the mock |
| `Cannot find module 'server-only'` | Test imported a server-only file (transitively) | Move logic out of server-only file, or mock the boundary |
| `ReferenceError: Request is not defined` | Node < 18 | Upgrade Node, or polyfill (`whatwg-fetch`) |
| Re-render loop on a page using `useSearchParams` | Mock returns `new URLSearchParams()` per call | Stable reference: `const params = new URLSearchParams(); useSearchParams: () => params` |
| `next/image` warns about width/height | Missing required props in test data | Pass `width` + `height` even in test fixtures |

---

## Related

- `runners/jest.md` — Jest in App Router projects (current default)
- `runners/vitest.md` — Vitest works too; same mocks
- `stacks/redux-toolkit.md` — RTK store in App Router
- `qa/automation/playwright.md` — E2E for pages/server components
