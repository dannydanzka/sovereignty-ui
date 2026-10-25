/**
 * The one way a module moves: by route name, with typed params.
 */

import { useMemo } from 'react';

import type { CatalogParamList } from '@apps/mod-catalog/navigation';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

import type { AppRouteName } from '../../types/navigation.interfaces';

export const useAppNavigation = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  return useMemo(
    () => ({
      goBack: () => navigation.goBack(),
      navigateTo: <R extends AppRouteName>(route: R, params: CatalogParamList[R]) => {
        const target: string = route;
        navigation.navigate(target, params ?? undefined);
      },
    }),
    [navigation]
  );
};
