/**
 * The compound parts are exported by NAME as well as through `Sidebar.*`, because static properties
 * do not survive the React Server Component boundary — see the note in `AppFooter.tsx`.
 */
export * from './Sidebar';
export * from './Sidebar.helpers';
export * from './SidebarFooter';
export * from './SidebarHeader';
export * from './SidebarNav';
export type * from './Sidebar.interfaces';
