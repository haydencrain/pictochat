import * as React from 'react';
import { Modal, Button, Loader, Dimmer } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import StoresContext, { IStoresContext } from '../../contexts/StoresContext';
import ImageDropzone from '../ImageDropzone';
import { useImage } from '../../hooks/ImageHooks';
import { useToggleModal } from '../../hooks/ModalHooks';
import { User } from '../../models/User';
import './ImageUploadModal.less';

export type TriggerTypes = 'button' | 'link';

export interface ImageUploadModalProps {
  triggerType: TriggerTypes;
  triggerContent?: any;
  // Use this to display an alert before preventing the model from openning if the user is not logged in (for example)
  shouldOpen: (stores: IStoresContext) => Promise<boolean>;
  onSubmit: (image: File) => Promise<void>;
}

function ImageUploadModal(props: ImageUploadModalProps) {
  //// DATA ////
  const stores = React.useContext(StoresContext);

  //// HOOKS ////

  const { isActive, onOpen, onClose } = useToggleModal();
  const [isLoading, setLoading] = React.useState(false);
  const { image, base64, addNewImage, clearImage } = useImage({
    onSetImageDone: () => setLoading(false)
  });

  //// CALLBACKS ////

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
    setLoading(true);
    await props.onSubmit(image);
    setLoading(false);
    handleClose();
  };

  const handleOpen = async () => {
    if (await props.shouldOpen(stores)) {
      onOpen();
    }
  };

  //// RENDERING ////

  const renderDropzoneOrImg = () => {
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
          <div className="link" onClick={handleOpen} role="button">
            {content}
          </div>
        );
    }
  };

  return (
    <Modal
      className="image-upload-modal"
      trigger={renderModalTrigger()}
      open={isActive}
      onClose={handleClose}
      closeIcon={false}
    >
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

export default ImageUploadModal;
// export default observer(ImageUploadModal);
