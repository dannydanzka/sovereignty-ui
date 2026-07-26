/**
 * PageHeader
 *
 * Title (+ optional one-line description) on the left, actions on the right. Every screen re-derives
 * this row — and each copy picks its own gap, its own wrap behaviour and its own vertical alignment,
 * so "the same header" quietly differs on every page. The title stays a node on purpose: a product
 * may style its heading (brand colour, its own scale) without the layout being copied along with it.
 */

import type { PageHeaderProps } from './PageHeader.interfaces';
import { PageTitle } from '../../components/PageLayout';

import { Description, HeaderWrapper, TitleColumn } from './PageHeader.styled';

export const PageHeader = ({ actions, className, description, title }: PageHeaderProps) => (
  <HeaderWrapper className={className} data-testid='page-header'>
    <TitleColumn>
      {typeof title === 'string' ? <PageTitle>{title}</PageTitle> : title}
      {description ? <Description>{description}</Description> : null}
    </TitleColumn>
    {actions ?? null}
  </HeaderWrapper>
);
