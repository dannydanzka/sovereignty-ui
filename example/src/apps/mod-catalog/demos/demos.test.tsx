import { render, screen } from '@testing-library/react-native';

import { DEMOS } from './demos.constants';

describe('demos', () => {
  it('registers each demo once', () => {
    const ids = DEMOS.map(({ id }) => id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(DEMOS.map((demo) => [demo.name, demo] as const))(
    '%s renders on native',
    async (_name, demo) => {
      const Demo = demo.getComponent();

      await render(<Demo />);

      expect(screen.toJSON()).not.toBeNull();
    }
  );
});
