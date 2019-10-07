import * as React from 'react';
import { Modal, Button, Loader, Dimmer } from 'semantic-ui-react';
import { useImage } from '../../hooks/ImageHooks';
import { useToggleModal } from '../../hooks/ModalHooks';
import './ShowImageModal.less';

export type TriggerTypes = 'button' | 'link';

export interface ShowImageModalProps {
  imageSrc: string;
  trigger: JSX.Element;
}

export default function ShowImageModal(props: ShowImageModalProps) {
  const { isActive, onOpen, onClose } = useToggleModal();
  const [isLoading, setLoading] = React.useState(true);
  const { image, base64, addNewImage, clearImage } = useImage({
    onSetImageDone: () => setLoading(false)
  });

  return (
    <Modal
      className="show-image-modal"
      trigger={
        <div className="show-image-trigger" onClick={onOpen}>
          {props.trigger}
        </div>
      }
      open={isActive}
      onClose={onClose}
      closeIcon
      basic
    >
      <Modal.Content className="modal-content">
        <img src={props.imageSrc} onLoad={() => setLoading(false)} onError={() => setLoading(false)} />
      </Modal.Content>
      <Dimmer active={isLoading}>
        <Loader />
      </Dimmer>
    </Modal>
  );
}
