/**
 * Demo: one component in every variant and state the library supports on native.
 */

import { DEMO_NOT_FOUND } from './DemoScreen.constants';
import { useDemoScreen } from './hooks/useDemoScreen';

import { Content, DemoTitle, Missing, Scroll } from './DemoScreen.styled';

export const DemoScreen = () => {
  const { Demo, name } = useDemoScreen();

  return (
    <Scroll>
      <Content>
        <DemoTitle>{name}</DemoTitle>
        {Demo ? <Demo /> : <Missing>{DEMO_NOT_FOUND}</Missing>}
      </Content>
    </Scroll>
  );
};
