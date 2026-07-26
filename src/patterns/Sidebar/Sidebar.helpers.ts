/** Sidebar pure logic — no DOM, no router. */

import type { IsNavItemActiveOptions } from './Sidebar.interfaces';

/**
 * Which nav entry is highlighted.
 *
 * The section root must match EXACTLY, otherwise it stays active on every child route and two
 * entries look selected at once. Children match on a path SEGMENT boundary (`${href}/`), so
 * `/admin/assets` no longer lights up for `/admin/assets-import` — a prefix test alone does.
 */
export const isNavItemActive = ({
  currentPath,
  homeHref,
  href,
}: IsNavItemActiveOptions): boolean => {
  if (homeHref !== undefined && href === homeHref) return currentPath === homeHref;
  return currentPath === href || currentPath.startsWith(`${href}/`);
};
