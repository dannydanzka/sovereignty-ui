/**
 * One labelled block of a demo: a variant, a state or a hook in use.
 */

import type { DemoSectionProps } from './DemoSection.interfaces';

import { SectionCard, SectionTitle } from './DemoSection.styled';

export const DemoSection = ({ children, title }: DemoSectionProps) => (
  <SectionCard>
    <SectionTitle>{title}</SectionTitle>
    {children}
  </SectionCard>
);
