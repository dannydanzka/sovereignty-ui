/**
 * ImagePreviewModal: Vista previa de imagen (useModal).
 */

import { Button, ImagePreviewModal, useModal } from '@dannydanzka/sovereignty-ui';

import { DemoSection } from '../../presentation/components';

export const ImagePreviewModalDemo = () => {
  const { close, isOpen, open } = useModal();

  return (
    <DemoSection title='Abrir vista previa'>
      <Button onClick={open} variant='secondary'>
        Ver imagen
      </Button>
      <ImagePreviewModal
        description='Imagen remota dentro del Modal nativo.'
        imageUrl='https://picsum.photos/600/800'
        isOpen={isOpen}
        onClose={close}
        title='Vista previa'
      />
    </DemoSection>
  );
};
