import * as React from 'react';
import { Modal, Button, Loader, Dimmer } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import ImageDropzone from '../ImageDropzone';
import { useImage } from '../../../hooks/ImageHooks';
import { useToggleModal } from '../../../hooks/ModalHooks';
import classnames from 'classnames';
import './ImageUploadModal.less';

export type TriggerTypes = 'button' | 'link';

export interface ImageUploadModalProps {
  /**
   * Provide a class name to the root element of this component
   */
  className?: string;
  /**
   * Determines whether the modal's trigger should either be a modal, or a link
   */
  triggerType: TriggerTypes;
  /**
   * The message the trigger should display
   */
  triggerContent?: any;
  /**
   * Callback function that is executed when an open trigger is activated, and is
   * used to determine whether the modal should open.
   * Return false if you want to prevent it from opening.
   * @function
   */
  shouldOpen: () => boolean;
  onSubmit: (image: File) => Promise<void>;
}

/**
 * A React component which provides an modal for uploading and submitting images.
 * @component
 * @param { ImageUploadModalProps } props - The component's props
 */
function ImageUploadModal(props: ImageUploadModalProps) {
  /* Hooks */
  const { isActive, onOpen, onClose } = useToggleModal();
  const [isLoading, setLoading] = React.useState(false);
  const { image, base64, addNewImage, clearImage } = useImage({
    onSetImageDone: () => setLoading(false)
  });

  /* Callbacks */
  const handleImageUpload = (file: File) => {
    setLoading(true);
    addNewImage(file);
  };

  const handleClose = () => {
    clearImage();
    onClose();
  };

  const handleSubmit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    if (!!image) {
      setLoading(true);
      await props.onSubmit(image);
      setLoading(false);
      handleClose();
    } else {
      alert('You have not uploaded an image yet!');
    }
  };

  const handleOpen = async () => {
    if (props.shouldOpen()) {
      onOpen();
    }
  };

  /* Rendering */

  const renderDropzoneOrImg = () => {
    // if an image has been uploaded, display the image, otherwise display the images dropzone
    if (!!base64) return <img src={base64} />;
    return <ImageDropzone onImageUpload={handleImageUpload} />;
  };

  const renderModalTrigger = () => {
    const content = props.triggerContent || 'Add Post';
    switch (props.triggerType) {
      case 'button':
        return (
          <Button primary onClick={handleOpen}>
            {content}
          </Button>
        );
      case 'link':
        return (
          <button className="link" onClick={handleOpen}>
            {content}
          </button>
        );
    }
  };

  const className = classnames('image-upload-modal', props.className);

  return (
    <Modal className={className} trigger={renderModalTrigger()} open={isActive} onClose={handleClose} closeIcon={false}>
      <Modal.Header>Upload an Image</Modal.Header>
      <Modal.Content className="modal-content">{renderDropzoneOrImg()}</Modal.Content>

      <Modal.Actions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button primary onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Actions>

      <Dimmer inverted active={isLoading}>
        <Loader />
      </Dimmer>
    </Modal>
  );
}

export default observer(ImageUploadModal);
