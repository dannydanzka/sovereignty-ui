/**
 * The current screen params, typed by its route name.
 */

import type { CatalogParamList } from '@apps/mod-catalog/navigation';
import type { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

import type { AppRouteName } from '../../types/navigation.interfaces';

export const useRouteParams = <R extends AppRouteName>(): RouteProp<
  CatalogParamList,
  R
>['params'] => useRoute<RouteProp<CatalogParamList, R>>().params;
