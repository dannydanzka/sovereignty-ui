/**
 * Modal: Diálogo y confirmación (useModal).
 */

import { Button, Modal, useModal } from '@dannydanzka/sovereignty-ui';

import { DemoCaption, DemoRow, DemoSection } from '../../presentation/components';

export const ModalDemo = () => {
  const dialog = useModal();
  const confirm = useModal();

  return (
    <DemoSection title='Abrir'>
      <DemoRow>
        <Button onClick={dialog.open} variant='primary'>
          Diálogo
        </Button>
        <Button onClick={confirm.open} variant='danger'>
          Confirmación
        </Button>
      </DemoRow>
      <Modal isOpen={dialog.isOpen} onClose={dialog.close} title='Modal nativo'>
        <DemoCaption>El host es el Modal de React Native; ciérralo con la X.</DemoCaption>
      </Modal>
      <Modal
        confirmText='Eliminar'
        isOpen={confirm.isOpen}
        message='Esta acción no se puede deshacer.'
        onClose={confirm.close}
        onConfirm={confirm.close}
        title='¿Eliminar la evidencia?'
        variant='confirm'
      />
    </DemoSection>
  );
};
