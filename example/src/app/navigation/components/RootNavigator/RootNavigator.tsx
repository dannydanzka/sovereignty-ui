/**
 * One native stack: the catalog, then a demo per component.
 */

import type { CatalogParamList } from '@apps/mod-catalog/navigation';
import { catalogScreens } from '@apps/mod-catalog/navigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator<CatalogParamList>();

export const RootNavigator = () => (
  <Stack.Navigator screenOptions={{ freezeOnBlur: true }}>
    {catalogScreens.map(({ getComponent, name, options }) => (
      <Stack.Screen getComponent={getComponent} key={name} name={name} options={options} />
    ))}
  </Stack.Navigator>
);
