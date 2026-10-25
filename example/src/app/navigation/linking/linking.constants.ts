/**
 * Deep links open any demo directly (`sui://demo/button`), so a demo can be checked without tapping.
 */

import type { CatalogParamList } from '@apps/mod-catalog/navigation';
import type { LinkingOptions } from '@react-navigation/native';

import { getLaunchUrl } from './linking.helpers';

export const LINKING: LinkingOptions<CatalogParamList> = {
  config: {
    screens: {
      Catalog: '',
      Demo: 'demo/:demoId',
    },
  },
  getInitialURL: getLaunchUrl,
  prefixes: ['sui://'],
};
