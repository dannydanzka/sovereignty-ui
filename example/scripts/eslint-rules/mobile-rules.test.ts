/** Invalid cases are the shortcuts each rule exists to stop. */
import { RuleTester } from 'eslint';
import * as parser from '@typescript-eslint/parser';

import { lazyScreenRegistrationRule } from './lazy-screen-registration.js';
import { moduleBoundariesRule } from './module-boundaries.js';
import { nativeStackOnlyRule } from './native-stack-only.js';
import { navigationPublicEntryRule } from './navigation-public-entry.js';
import { noRawPrimitivesRule } from './no-raw-primitives.js';

const ruleTester = new RuleTester({
  languageOptions: { parser, parserOptions: { ecmaFeatures: { jsx: true } }, sourceType: 'module' },
});

const SCREEN = '/repo/src/apps/mod-home/presentation/screens/HomeScreen/HomeScreen.tsx';
const ROUTES = '/repo/src/apps/mod-home/navigation/home.constants.ts';
const LIB = '/repo/src/libs/state/slices/session/session.thunks.ts';
const APP = '/repo/src/app/navigation/components/RootNavigator/RootNavigator.tsx';

ruleTester.run('navigation-public-entry', navigationPublicEntryRule, {
  invalid: [
    {
      code: "import { useNavigation } from '@react-navigation/native';",
      errors: [{ messageId: 'library' }],
      filename: SCREEN,
    },
    {
      code: "import { ROUTE_PATHS } from '@app/navigation/registry';",
      errors: [{ messageId: 'deepImport' }],
      filename: SCREEN,
    },
  ],
  valid: [
    { code: "import { useAppNavigation } from '@app/navigation';", filename: SCREEN },
    {
      code: "import { createNativeStackNavigator } from '@react-navigation/native-stack';",
      filename: APP,
    },
  ],
});

ruleTester.run('lazy-screen-registration', lazyScreenRegistrationRule, {
  invalid: [
    {
      code: "import { HomeScreen } from '../presentation/screens/HomeScreen';\nexport const s = [{ getComponent: () => HomeScreen, name: 'Home' }];",
      errors: [{ messageId: 'notLazy' }],
      filename: ROUTES,
    },
    {
      code: '<Stack.Screen component={HomeScreen} name="Home" />',
      errors: [{ messageId: 'eagerScreen' }],
      filename: APP,
    },
  ],
  valid: [
    {
      code: "export const s = [{ getComponent: () => require('../presentation/screens/HomeScreen/HomeScreen').HomeScreen, name: 'Home' }];",
      filename: ROUTES,
    },
    { code: '<Tabs.Screen component={HomeStack} name="HomeTab" />', filename: APP },
  ],
});

ruleTester.run('native-stack-only', nativeStackOnlyRule, {
  invalid: [
    {
      code: "import { createStackNavigator } from '@react-navigation/stack';",
      errors: [{ messageId: 'jsStack' }],
      filename: APP,
    },
  ],
  valid: [
    {
      code: "import { createNativeStackNavigator } from '@react-navigation/native-stack';",
      filename: APP,
    },
  ],
});

ruleTester.run('module-boundaries', moduleBoundariesRule, {
  invalid: [
    {
      code: "import { LOGIN_COPY } from '@apps/mod-auth/presentation';",
      errors: [{ messageId: 'crossModule' }],
      filename: SCREEN,
    },
    {
      code: "import { x } from '../../../../mod-auth/navigation';",
      errors: [{ messageId: 'crossModule' }],
      filename: SCREEN,
    },
    {
      code: "import { store } from '@app/store';",
      errors: [{ messageId: 'appInternals' }],
      filename: SCREEN,
    },
    {
      code: "import { APP_ROUTES } from '@app/navigation';",
      errors: [{ messageId: 'libsUpward' }],
      filename: LIB,
    },
  ],
  valid: [
    { code: "import { useAppNavigation } from '@app/navigation';", filename: SCREEN },
    { code: "import { useHomeScreen } from './hooks/useHomeScreen';", filename: SCREEN },
    { code: "import { authScreens } from '@apps/mod-auth/navigation';", filename: APP },
  ],
});

ruleTester.run('no-raw-primitives', noRawPrimitivesRule, {
  invalid: [
    {
      code: "import { Text, View } from 'react-native';\nconst A = () => <View><Text>Hola</Text></View>;",
      errors: [{ messageId: 'rawPrimitive' }, { messageId: 'rawPrimitive' }],
      filename: SCREEN,
    },
  ],
  valid: [
    {
      code: "import { Span } from '@dannydanzka/sovereignty-ui';\nconst A = () => <Span>Hola</Span>;",
      filename: SCREEN,
    },
    {
      code: "import { FlatList } from 'react-native';\nconst A = () => <FlatList data={[]} renderItem={null} />;",
      filename: SCREEN,
    },
  ],
});
