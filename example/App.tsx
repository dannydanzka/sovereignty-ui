/**
 * Native example app
 *
 * Proving ground for @dannydanzka/sovereignty-ui on React Native. The library
 * resolves from the parent folder (`file:..` symlink + Metro watchFolders) so
 * component changes hot-reload here.
 *
 * @format
 */

import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { Gallery } from './Gallery';
import { applyBrand } from './brand';

applyBrand();

const safeAreaStyle = { flex: 1 };

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={safeAreaStyle}>
        <Gallery />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;
