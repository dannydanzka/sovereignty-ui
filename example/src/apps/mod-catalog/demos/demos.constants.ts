/**
 * Every native-ready export of the library, one demo each; a demo loads only when opened.
 */

import type { DemoRegistration } from './demos.interfaces';

export const DEMO_CATEGORIES = {
  COMPONENTS: 'Componentes',
  FOUNDATIONS: 'Fundamentos',
  PATTERNS: 'Patrones',
} as const;

/** The catalog reads foundations first, then components, then patterns. */
export const DEMO_CATEGORY_ORDER = [
  DEMO_CATEGORIES.FOUNDATIONS,
  DEMO_CATEGORIES.COMPONENTS,
  DEMO_CATEGORIES.PATTERNS,
] as const;

export const DEMOS: DemoRegistration[] = [
  {
    category: DEMO_CATEGORIES.FOUNDATIONS,
    getComponent: () => require('./TokensDemo/TokensDemo').TokensDemo,
    id: 'tokens',
    name: 'Tokens',
  },
  {
    category: DEMO_CATEGORIES.FOUNDATIONS,
    getComponent: () => require('./PrimitivesDemo/PrimitivesDemo').PrimitivesDemo,
    id: 'primitives',
    name: 'Primitives',
  },
  {
    category: DEMO_CATEGORIES.COMPONENTS,
    getComponent: () => require('./AlertDemo/AlertDemo').AlertDemo,
    id: 'alert',
    name: 'Alert',
  },
  {
    category: DEMO_CATEGORIES.COMPONENTS,
    getComponent: () => require('./AvatarDemo/AvatarDemo').AvatarDemo,
    id: 'avatar',
    name: 'Avatar',
  },
  {
    category: DEMO_CATEGORIES.COMPONENTS,
    getComponent: () => require('./BadgeDemo/BadgeDemo').BadgeDemo,
    id: 'badge',
    name: 'Badge',
  },
  {
    category: DEMO_CATEGORIES.COMPONENTS,
    getComponent: () => require('./ButtonDemo/ButtonDemo').ButtonDemo,
    id: 'button',
    name: 'Button',
  },
  {
    category: DEMO_CATEGORIES.COMPONENTS,
    getComponent: () => require('./CardDemo/CardDemo').CardDemo,
    id: 'card',
    name: 'Card',
  },
  {
    category: DEMO_CATEGORIES.COMPONENTS,
    getComponent: () => require('./CheckboxDemo/CheckboxDemo').CheckboxDemo,
    id: 'checkbox',
    name: 'Checkbox',
  },
  {
    category: DEMO_CATEGORIES.COMPONENTS,
    getComponent: () => require('./DividerDemo/DividerDemo').DividerDemo,
    id: 'divider',
    name: 'Divider',
  },
  {
    category: DEMO_CATEGORIES.COMPONENTS,
    getComponent: () => require('./EmptyStateDemo/EmptyStateDemo').EmptyStateDemo,
    id: 'empty-state',
    name: 'EmptyState',
  },
  {
    category: DEMO_CATEGORIES.COMPONENTS,
    getComponent: () =>
      require('./ImagePreviewModalDemo/ImagePreviewModalDemo').ImagePreviewModalDemo,
    id: 'image-preview-modal',
    name: 'ImagePreviewModal',
  },
  {
    category: DEMO_CATEGORIES.COMPONENTS,
    getComponent: () => require('./InlineIconDemo/InlineIconDemo').InlineIconDemo,
    id: 'inline-icon',
    name: 'InlineIcon',
  },
  {
    category: DEMO_CATEGORIES.COMPONENTS,
    getComponent: () => require('./InputDemo/InputDemo').InputDemo,
    id: 'input',
    name: 'Input',
  },
  {
    category: DEMO_CATEGORIES.COMPONENTS,
    getComponent: () => require('./ModalDemo/ModalDemo').ModalDemo,
    id: 'modal',
    name: 'Modal',
  },
  {
    category: DEMO_CATEGORIES.COMPONENTS,
    getComponent: () =>
      require('./NotificationToastDemo/NotificationToastDemo').NotificationToastDemo,
    id: 'notification-toast',
    name: 'NotificationToast',
  },
  {
    category: DEMO_CATEGORIES.COMPONENTS,
    getComponent: () => require('./ProgressBarDemo/ProgressBarDemo').ProgressBarDemo,
    id: 'progress-bar',
    name: 'ProgressBar',
  },
  {
    category: DEMO_CATEGORIES.COMPONENTS,
    getComponent: () => require('./SearchInputDemo/SearchInputDemo').SearchInputDemo,
    id: 'search-input',
    name: 'SearchInput',
  },
  {
    category: DEMO_CATEGORIES.COMPONENTS,
    getComponent: () => require('./SpacerDemo/SpacerDemo').SpacerDemo,
    id: 'spacer',
    name: 'Spacer',
  },
  {
    category: DEMO_CATEGORIES.COMPONENTS,
    getComponent: () => require('./StackDemo/StackDemo').StackDemo,
    id: 'stack',
    name: 'Stack',
  },
  {
    category: DEMO_CATEGORIES.COMPONENTS,
    getComponent: () => require('./StatsCardDemo/StatsCardDemo').StatsCardDemo,
    id: 'stats-card',
    name: 'StatsCard',
  },
  {
    category: DEMO_CATEGORIES.COMPONENTS,
    getComponent: () => require('./TextareaDemo/TextareaDemo').TextareaDemo,
    id: 'textarea',
    name: 'Textarea',
  },
  {
    category: DEMO_CATEGORIES.COMPONENTS,
    getComponent: () => require('./ToggleDemo/ToggleDemo').ToggleDemo,
    id: 'toggle',
    name: 'Toggle',
  },
  {
    category: DEMO_CATEGORIES.PATTERNS,
    getComponent: () => require('./DataTableDemo/DataTableDemo').DataTableDemo,
    id: 'data-table',
    name: 'DataTable',
  },
  {
    category: DEMO_CATEGORIES.PATTERNS,
    getComponent: () =>
      require('./NotificationContainerDemo/NotificationContainerDemo').NotificationContainerDemo,
    id: 'notification-container',
    name: 'NotificationContainer',
  },
  {
    category: DEMO_CATEGORIES.PATTERNS,
    getComponent: () => require('./StatusBadgeDemo/StatusBadgeDemo').StatusBadgeDemo,
    id: 'status-badge',
    name: 'StatusBadge',
  },
];
