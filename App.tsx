/**
 * sovereignty-ui-lab
 *
 * Local testing ground for @dannydanzka/sovereignty-ui on React Native.
 * The library resolves from ../sovereignty-ui (file: symlink + Metro
 * watchFolders) so component changes hot-reload here.
 *
 * @format
 */

import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { GalleryScreen } from './src/libs/presentation/screens/GalleryScreen';
import { applyLabBrand } from './src/libs/shared/tokens/brand';

applyLabBrand();

const safeAreaStyle = { flex: 1 };

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={safeAreaStyle}>
        <GalleryScreen />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;
