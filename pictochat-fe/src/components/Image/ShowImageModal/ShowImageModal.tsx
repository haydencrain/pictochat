import * as React from 'react';
import { Modal, Loader, Dimmer } from 'semantic-ui-react';
import { useToggleModal } from '../../../hooks/ModalHooks';
import './ShowImageModal.less';

export interface ShowImageModalProps {
  /**
   * The Image url (or data) to load
   */
  imageSrc: string;
  /**
   * The element that (when clicked) will trigger the modal to open
   */
  trigger: JSX.Element;
}

/**
 * A React component which provides an modal for viewing an image
 * @component
 * @param { ShowImageModalProps } props - The component's props
 */
export default function ShowImageModal(props: ShowImageModalProps) {
  const { isActive, onOpen, onClose } = useToggleModal();
  const [isLoading, setLoading] = React.useState(true);

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
