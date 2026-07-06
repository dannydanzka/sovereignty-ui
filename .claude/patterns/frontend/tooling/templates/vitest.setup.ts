/**
 * Vitest Setup File
 *
 * Global setup for all tests.
 * This file runs after the test framework is installed but before test code.
 *
 * NOTE: clearMocks and restoreMocks are configured in vitest.config.ts,
 * so there is NO need for beforeEach(clearAllMocks) or afterEach(restoreAllMocks) here.
 */

import { afterAll, beforeAll, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

import '@i18n/i18n.config';

export { FIXED_SYSTEM_TIME } from '@testing/constants';

const createSovereigntyMock = vi.hoisted(() => {
  return (R: typeof import('react'), name: string, tag = 'div', testId?: string) => {
    const C = ({ children, ...props }: Record<string, unknown>) =>
      R.createElement(
        tag,
        { 'data-testid': testId ?? name.toLowerCase(), ...props },
        children as import('react').ReactNode
      );
    C.displayName = name;
    return C;
  };
});

const createSovereigntyComplexMocks = vi.hoisted(() => {
  type R = typeof import('react');
  type N = import('react').ReactNode;
  type P = Record<string, unknown>;

  return (React: R) => ({
    Image: ({ alt, fallbackIcon, src, ...props }: P) =>
      src
        ? React.createElement('img', { alt, src, ...props })
        : React.createElement(
            'div',
            { 'data-testid': 'image-placeholder', ...props },
            fallbackIcon as N
          ),
    Modal: ({ children, footer, isOpen, title }: P) =>
      isOpen
        ? React.createElement(
            'div',
            { 'data-testid': 'modal', role: 'dialog' },
            title ? React.createElement('h2', null, title as N) : null,
            children as N,
            footer
              ? React.createElement('div', { 'data-testid': 'modal-footer' }, footer as N)
              : null
          )
        : null,
    NotificationToast: ({ notification, onClose }: P) => {
      const n = notification as { message?: string; title?: string };
      return React.createElement(
        'div',
        { 'data-testid': 'notification-toast' },
        n?.title ? React.createElement('span', null, n.title) : null,
        n?.message ? React.createElement('span', null, n.message) : null,
        React.createElement('button', { 'aria-label': 'close', onClick: onClose }, '×')
      );
    },
    ProgressBar: ({ label, value, ...props }: P) =>
      React.createElement(
        'div',
        { 'data-testid': 'progress-bar', ...props },
        label ? React.createElement('span', null, label as N) : null,
        React.createElement('div', { 'aria-valuenow': value, role: 'progressbar' })
      ),
    StatsCard: ({ label, value, ...props }: P) =>
      React.createElement(
        'div',
        { 'data-testid': 'stats-card', ...props },
        React.createElement('span', null, value as N),
        React.createElement('span', null, label as N)
      ),
  });
});

vi.mock('@dannydanzka/sovereignty-ui', async () => {
  const React = await import('react');
  const m = (name: string, tag = 'div', testId?: string) =>
    createSovereigntyMock(React, name, tag, testId);

  return {
    Badge: m('Badge', 'span', 'badge'),
    Button: m('Button', 'button', 'button'),
    EmptyState: m('EmptyState', 'div', 'empty-state'),
    ErrorState: m('ErrorState', 'div', 'error-state'),
    InfoMessage: m('InfoMessage', 'div', 'info-message'),
    Input: m('Input', 'input', 'input'),
    LoadingState: m('LoadingState', 'div', 'loading-state'),
    ModalActions: m('ModalActions', 'div', 'modal-actions'),
    ModalFooter: m('ModalFooter', 'div', 'modal-footer'),
    PopButton: m('PopButton', 'button', 'pop-button'),
    TapHint: m('TapHint', 'div', 'tap-hint'),
    ToggleActiveButton: m('ToggleActiveButton', 'button', 'toggle-active-button'),
    ...createSovereigntyComplexMocks(React),
  };
});

vi.mock('uuid', () => ({
  v4: () => 'mocked-uuid-v4',
  v5: () => 'mocked-uuid-v5',
}));

vi.mock('bcryptjs', () => ({
  compare: vi.fn().mockResolvedValue(true),
  default: {
    compare: vi.fn().mockResolvedValue(true),
    hash: vi.fn().mockResolvedValue('$2a$10$mocked-hash-value'),
  },
  hash: vi.fn().mockResolvedValue('$2a$10$mocked-hash-value'),
}));

vi.mock('next/navigation', () => ({
  usePathname() {
    return '/';
  },
  useRouter() {
    return {
      back: vi.fn(),
      forward: vi.fn(),
      prefetch: vi.fn(),
      push: vi.fn(),
      refresh: vi.fn(),
      replace: vi.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

vi.mock('next/server', () => {
  class MockNextRequest {
    body: BodyInit | null | undefined;
    headers: Headers;
    method: string;
    nextUrl: { searchParams: URLSearchParams };
    url: string;

    constructor(input: string | Request | URL, init?: RequestInit) {
      this.url = typeof input === 'string' ? input : input.toString();
      this.body = init?.body;
      this.headers = new Headers(init?.headers);
      this.method = init?.method || 'GET';
      this.nextUrl = {
        searchParams: new URLSearchParams(new URL(this.url).search),
      };
    }

    json() {
      return Promise.resolve({});
    }

    text() {
      return Promise.resolve('');
    }
  }

  return {
    NextRequest: MockNextRequest,
    NextResponse: {
      json: vi.fn((data, options) => ({
        headers: new Headers(),
        json: vi.fn().mockResolvedValue(data),
        status: options?.status || 200,
      })),
      redirect: vi.fn((url) => ({
        headers: new Headers({ Location: url }),
        status: 302,
      })),
    },
  };
});

vi.mock('next/image', () => ({
  default: (props: { alt?: string; [key: string]: unknown }) => {
    const { alt = '', ...rest } = props;
    return {
      props: { ...rest, alt },
      type: 'img',
    };
  },
}));

vi.mock('next/dynamic', async () => {
  const React = await vi.importActual<typeof import('react')>('react');
  return {
    default: function mockDynamic() {
      const MockedComponent = (props: Record<string, unknown>) => {
        return React.createElement('div', { 'data-testid': 'dynamic-component', ...props });
      };
      MockedComponent.displayName = 'DynamicComponent';
      return MockedComponent;
    },
  };
});

vi.mock('@database', () => ({
  getStorageClient: () => ({ client: null, isConfigured: false }),
  isSupabaseAdminConfigured: false,
  isSupabaseConfigured: false,
  supabase: null,
  supabaseAdmin: null,
}));

vi.mock('@logger', () => ({
  logError: vi.fn(),
  logInfo: vi.fn(),
  logWarning: vi.fn(),
}));

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn().mockImplementation(() => ({
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  })),
}));

vi.mock('@prisma/adapter-pg', () => ({
  PrismaPg: vi.fn().mockImplementation(() => ({})),
}));

const { mockValidateAndGetUser } = vi.hoisted(() => ({
  mockValidateAndGetUser: vi.fn(),
}));

vi.mock('@helpers', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    validateAndGetUser: mockValidateAndGetUser,
  };
});

vi.mock('@helpers/use-case/authorization', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    validateAndGetUser: mockValidateAndGetUser,
  };
});

vi.mock('@helpers/use-case/authorization/authorization', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    validateAndGetUser: mockValidateAndGetUser,
  };
});

if (!process.env['NEXT_PUBLIC_APP_URL']) {
  process.env['NEXT_PUBLIC_APP_URL'] = 'http://localhost:3000';
}

const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const errorStack = Error().stack || '';
    const isJSDOMError =
      errorStack.includes('xhr-utils.js') || errorStack.includes('XMLHttpRequest');

    if (
      (typeof args[0] === 'string' &&
        args[0].includes('Warning: ReactDOM.render is no longer supported')) ||
      (typeof args[0] === 'string' && args[0].includes('Warning: validateDOMNesting')) ||
      (typeof args[0] === 'string' && args[0].includes('not wrapped in act(...)')) ||
      (typeof args[0] === 'string' &&
        args[0].includes(
          'When testing, code that causes React state updates should be wrapped into act'
        )) ||
      (isJSDOMError && args[0] instanceof Error) ||
      (args[0] instanceof Error &&
        args[0].name === 'AggregateError' &&
        (args[1] as { type?: string })?.type === 'XMLHttpRequest') ||
      (typeof args[0] === 'string' && args[0].includes('A non-serializable value was detected'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args: unknown[]) => {
    if (
      (typeof args[0] === 'string' &&
        args[0].includes('componentWillReceiveProps has been renamed')) ||
      (typeof args[0] === 'string' &&
        args[0].includes('Selector unknown returned the root state')) ||
      (typeof args[0] === 'string' && args[0].includes('This can lead to unnecessary rerenders'))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation((query: string) => ({
    addEventListener: vi.fn(),
    addListener: vi.fn(),
    dispatchEvent: vi.fn(),
    matches: false,
    media: query,
    onchange: null,
    removeEventListener: vi.fn(),
    removeListener: vi.fn(),
  })),
  writable: true,
});

class MockIntersectionObserver {
  callback: IntersectionObserverCallback;
  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn(() => [] as IntersectionObserverEntry[]);
  unobserve = vi.fn();

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  trigger(entries: IntersectionObserverEntry[]) {
    this.callback(entries, this as unknown as IntersectionObserver);
  }
}
global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

class MockResizeObserver {
  disconnect = vi.fn();
  observe = vi.fn();
  unobserve = vi.fn();
}
global.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

const storageMock = {
  clear: vi.fn(),
  getItem: vi.fn(),
  removeItem: vi.fn(),
  setItem: vi.fn(),
};

Object.defineProperty(window, 'localStorage', { value: storageMock });
Object.defineProperty(window, 'sessionStorage', { value: storageMock });

global.Request = global.Request || (vi.fn() as unknown as typeof Request);
global.Response = global.Response || (vi.fn() as unknown as typeof Response);
