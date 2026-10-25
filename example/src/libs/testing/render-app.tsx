/**
 * Renders the harness the way the device does: navigation container and root stack.
 */

import { render } from '@testing-library/react-native';

import { NavigationContainer } from '@react-navigation/native';

import { RootNavigator } from '../../app/navigation/components/RootNavigator';

export const renderApp = () =>
  render(
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
