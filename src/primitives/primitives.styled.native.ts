/**
 * Platform Primitives — React Native resolution
 *
 * Div → View, Span → Text. View already defaults to flex-direction: column
 * (Yoga), matching the web Div defaults, so shared styled(Div) declarations
 * lay out identically on both platforms.
 *
 * WebCompatProps lets shared component files keep passing className and
 * data-testid; React Native simply ignores them at runtime.
 */

import styled from 'styled-components/native';

import type { WebCompatProps } from './primitives.interfaces';

export const Div = styled.View<WebCompatProps>``;

export const Span = styled.Text<WebCompatProps>``;
