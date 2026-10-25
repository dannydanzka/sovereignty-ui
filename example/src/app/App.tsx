/**
 * The harness root: brand tokens first, then the catalog under a navigation container.
 */

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { NavigationContainer } from '@react-navigation/native';

import { applyBrand } from './brand';
import { LINKING } from './navigation/linking';
import { RootNavigator } from './navigation/components/RootNavigator';

applyBrand();

export const App = () => (
  <SafeAreaProvider>
    <NavigationContainer linking={LINKING}>
      <RootNavigator />
    </NavigationContainer>
  </SafeAreaProvider>
);
