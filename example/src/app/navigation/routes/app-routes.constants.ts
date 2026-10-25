import { CATALOG_ROUTES } from '@apps/mod-catalog/navigation';

/** Every route by constant, so a module never writes a route name as a string. */
export const APP_ROUTES = {
  ...CATALOG_ROUTES,
} as const;
