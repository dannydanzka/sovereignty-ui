/**
 * The catalog routes. Screens load on first visit: `getComponent` requires the file then.
 */

import type { ScreenRegistration } from '@app/navigation';

import type { CatalogParamList } from './catalog.types';

export const CATALOG_ROUTES = {
  CATALOG: 'Catalog',
  DEMO: 'Demo',
} as const;

export const catalogScreens: ScreenRegistration<CatalogParamList>[] = [
  {
    getComponent: () =>
      require('../presentation/screens/CatalogScreen/CatalogScreen').CatalogScreen,
    name: CATALOG_ROUTES.CATALOG,
    options: { title: 'sovereignty-ui' },
  },
  {
    getComponent: () => require('../presentation/screens/DemoScreen/DemoScreen').DemoScreen,
    name: CATALOG_ROUTES.DEMO,
  },
];
