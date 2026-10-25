/**
 * How a demo registers: what the catalog lists and how the demo screen loads it.
 */

import type { ComponentType } from 'react';

import type { DEMO_CATEGORIES } from './demos.constants';

export type DemoCategory = (typeof DEMO_CATEGORIES)[keyof typeof DEMO_CATEGORIES];

export interface DemoRegistration {
  category: DemoCategory;
  getComponent: () => ComponentType;
  id: string;
  name: string;
}
