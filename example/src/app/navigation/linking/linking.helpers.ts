/**
 * iOS launch arguments land in NSUserDefaults, so `simctl launch <udid> com.example -demo button` opens a
 * demo with no tap; a custom-scheme URL from the terminal needs one ("Open in…?").
 */

import { Linking, Platform, Settings } from 'react-native';

import { LAUNCH_DEMO_KEY } from './launch.constants';

export const getLaunchUrl = async (): Promise<string | null> => {
  const launchDemo: unknown = Platform.OS === 'ios' ? Settings.get(LAUNCH_DEMO_KEY) : null;
  if (typeof launchDemo === 'string' && launchDemo.length > 0) return `sui://demo/${launchDemo}`;
  return Linking.getInitialURL();
};
