/**
 * Navigation types: what each route receives, and how a module registers its screens.
 */

import type { ComponentType } from 'react';

import type { CatalogParamList } from '@apps/mod-catalog/navigation';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { ParamListBase } from '@react-navigation/native';

export interface ScreenRegistration<ParamList extends ParamListBase> {
  getComponent: () => ComponentType;
  name: Extract<keyof ParamList, string>;
  options?: NativeStackNavigationOptions;
}

/** One module today: its param list is the app's; a second module joins as `CatalogParamList & XParamList`. */
export type AppRouteName = keyof CatalogParamList;
