import * as React from 'react';
import { Modal, Button, Loader } from 'semantic-ui-react';
import { useImage } from '../../hooks/ImageHooks';
import ImageDropzone from '../ImageUpload';
import { useToggleModal } from '../../hooks/ModalHooks';
import './CreatePostModal.less';

interface CreatePostModalProps {
  buttonContent: any;
}

export default function CreatePostModal(props: CreatePostModalProps) {
  const { isActive, onOpen, onClose } = useToggleModal();
  const [isLoading, setLoading] = React.useState(false);
  const { image, base64, addNewImage, clearImage } = useImage({
    onSetImageDone: () => setLoading(false)
  });
  const handleImageUpload = (file: File) => {
    setLoading(true);
    addNewImage(file);
  };
  const handleClose = () => {
    clearImage();
    onClose();
  };
  const handleSubmit = () => {};

  const renderDropzoneOrImg = () => {
    if (isLoading) return <Loader active inline />;
    if (!!base64) return <img src={base64} />;
    return <ImageDropzone onImageUpload={handleImageUpload} />;
  };

  const renderModalTrigger = () => (
    <Button primary onClick={onOpen}>
      {props.buttonContent}
    </Button>
  );

  return (
    <Modal trigger={renderModalTrigger()} open={isActive} onClose={handleClose} closeIcon={false}>
      <Modal.Header>Upload an Image</Modal.Header>
      <Modal.Content>{renderDropzoneOrImg()}</Modal.Content>
      <Modal.Actions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button primary onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
