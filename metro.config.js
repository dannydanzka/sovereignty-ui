const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration — sovereignty-ui-lab
 * https://reactnative.dev/docs/metro
 *
 * sovereignty-ui is installed as file:../sovereignty-ui (symlink). Metro must:
 *  - watch the library folder for live reload while developing components
 *  - block the library's own node_modules (avoid duplicate react/styled-components)
 *  - force react/react-native/styled-components to resolve from THIS app
 * Pattern proven in betterware-ui (see its README metro snippet).
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const suiPath = path.resolve(__dirname, '../sovereignty-ui');
const appModules = path.resolve(__dirname, 'node_modules');

const config = {
  resolver: {
    blockList: [new RegExp(`^${suiPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/node_modules/.*`)],
    extraNodeModules: {
      '@babel/runtime': path.resolve(appModules, '@babel/runtime'),
      react: path.resolve(appModules, 'react'),
      'react-native': path.resolve(appModules, 'react-native'),
      'styled-components': path.resolve(appModules, 'styled-components'),
    },
    nodeModulesPaths: [appModules],
    unstable_enableSymlinks: true,
  },
  watchFolders: [suiPath],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
