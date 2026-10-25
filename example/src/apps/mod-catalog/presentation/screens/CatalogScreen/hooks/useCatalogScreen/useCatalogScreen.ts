/**
 * The catalog grouped by category, and the way into a demo.
 */

import { useMemo } from 'react';

import { APP_ROUTES, useAppNavigation } from '@app/navigation';

import { DEMO_CATEGORY_ORDER, DEMOS } from '../../../../../demos';

export const useCatalogScreen = () => {
  const { navigateTo } = useAppNavigation();

  const sections = useMemo(
    () =>
      DEMO_CATEGORY_ORDER.map((category) => ({
        data: DEMOS.filter((demo) => demo.category === category),
        title: category,
      })),
    []
  );

  return {
    openDemo: (demoId: string) => navigateTo(APP_ROUTES.DEMO, { demoId }),
    sections,
  };
};
