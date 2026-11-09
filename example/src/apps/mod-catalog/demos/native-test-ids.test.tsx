/** The ids E2E drivers select by must reach the native node; 0.36.0 shipped a regression no test here caught. */

import { fireEvent, render, screen } from '@testing-library/react-native';
import styled from 'styled-components/native';

import { Div } from '@dannydanzka/sovereignty-ui';

import { ButtonDemo } from './ButtonDemo/ButtonDemo';
import { CardDemo } from './CardDemo/CardDemo';
import { InputDemo } from './InputDemo/InputDemo';
import { TextareaDemo } from './TextareaDemo/TextareaDemo';

const ConsumerBox = styled(Div)``;

describe('testId on native', () => {
  it('lands on the pressable a driver taps', async () => {
    await render(<CardDemo />);

    await fireEvent.press(screen.getByTestId('card-pressable'));

    expect(screen.getByText('Presionable: 1 toques')).toBeOnTheScreen();
  });

  it('lands on the text field a driver types into', async () => {
    await render(<InputDemo />);

    await fireEvent.changeText(screen.getByTestId('input-email'), 'maria@test.com');

    expect(screen.getByDisplayValue('maria@test.com')).toBe(screen.getByTestId('input-email'));
  });

  it('reaches Button and Textarea', async () => {
    await render(
      <>
        <ButtonDemo />
        <TextareaDemo />
      </>
    );

    expect(screen.getByTestId('button-save')).toHaveTextContent('Guardar');
    expect(screen.getByTestId('textarea-notes')).toBe(screen.getByPlaceholderText('Escribe algo…'));
  });

  it("keeps a consumer's own testID on a styled primitive", async () => {
    await render(<ConsumerBox testID='consumer-box' />);

    expect(screen.getByTestId('consumer-box')).toBeOnTheScreen();
  });
});
