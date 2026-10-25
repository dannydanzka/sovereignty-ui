/**
 * Resolves the demo the route names; the component loads only now (`getComponent`).
 */

import { useMemo } from 'react';

import { useRouteParams } from '@app/navigation';

import { DEMOS } from '../../../../../demos';

export const useDemoScreen = () => {
  const { demoId } = useRouteParams<'Demo'>();

  return useMemo(() => {
    const demo = DEMOS.find(({ id }) => id === demoId);
    return { Demo: demo?.getComponent() ?? null, name: demo?.name ?? demoId };
  }, [demoId]);
};
