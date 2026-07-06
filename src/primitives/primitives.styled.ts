/**
 * Platform Primitives — web resolution
 *
 * The cross-platform building blocks of every shared component:
 *   Div  → <div>  on web, <View> on native (flexbox column by default, like Yoga)
 *   Span → <span> on web, <Text> on native (all raw text must live inside one)
 *
 * Philosophy: one component for web and mobile — write layout with flexbox
 * only, put every text node inside a Span, and styled(Div)/styled(Span)
 * everywhere instead of styled.div/styled.span.
 *
 * Metro resolves primitives.native.ts instead of this file for React Native.
 */

import styled from 'styled-components';

export const Div = styled.div`
  align-items: stretch;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;

export const Span = styled.span``;
