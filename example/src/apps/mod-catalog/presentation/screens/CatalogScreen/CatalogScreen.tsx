/**
 * Catalog: every native-ready component of the library, grouped; tap one to open its demo.
 */

import { useCatalogScreen } from './hooks/useCatalogScreen';

import { DemoItem, DemoName, Screen, SectionHeader } from './CatalogScreen.styled';

export const CatalogScreen = () => {
  const { openDemo, sections } = useCatalogScreen();

  return (
    <Screen>
      {sections.map(({ data, title }) => [
        <SectionHeader key={title}>{title}</SectionHeader>,
        ...data.map((demo) => (
          <DemoItem aria-label={demo.name} key={demo.id} onClick={() => openDemo(demo.id)}>
            <DemoName>{demo.name}</DemoName>
          </DemoItem>
        )),
      ])}
    </Screen>
  );
};
