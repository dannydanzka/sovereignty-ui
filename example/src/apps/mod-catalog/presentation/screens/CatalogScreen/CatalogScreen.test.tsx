import { fireEvent, screen } from '@testing-library/react-native';

import { renderApp } from '@testing';

import { DEMOS } from '../../../demos';

describe('CatalogScreen', () => {
  it('lists every demo of the registry', async () => {
    await renderApp();

    DEMOS.forEach(({ name }) => expect(screen.getByLabelText(name)).toBeOnTheScreen());
  });

  it('opens the demo a row names', async () => {
    await renderApp();

    await fireEvent.press(screen.getByLabelText('Badge'));

    expect(await screen.findByText('Variantes')).toBeOnTheScreen();
  });
});
