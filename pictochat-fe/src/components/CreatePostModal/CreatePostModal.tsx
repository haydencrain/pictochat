import * as React from 'react';
import { Modal, Button, Loader, Dimmer } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import StoresContext from '../../contexts/StoresContext';
import { useImage } from '../../hooks/ImageHooks';
import ImageDropzone from '../ImageDropzone';
import { useToggleModal } from '../../hooks/ModalHooks';
import NewPostPayload from '../../models/NewPostPayload';
import './CreatePostModal.less';
import { User } from '../../models/User';

type TriggerTypes = 'button' | 'link';

interface CreatePostModalProps {
  triggerType: TriggerTypes;
  triggerContent?: any;
  parentPostId?: string;
}

function CreatePostModal(props: CreatePostModalProps) {
  // Data
  const stores = React.useContext(StoresContext);
  const currentUser: User = stores.user.currentUser;

  // Hooks
  const { isActive, onOpen, onClose } = useToggleModal();
  const [isLoading, setLoading] = React.useState(false);
  const { image, base64, addNewImage, clearImage } = useImage({
    onSetImageDone: () => setLoading(false)
  });

  // Callbacks
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
    if (stores.user.isLoggedIn && !stores.user.isLoading) {
      console.log('USER: ', currentUser);
      const data: NewPostPayload = {
        userId: currentUser.userId,
        parentPostId: props.parentPostId || null,
        image: image
      };
      await stores.discussion.createPost(data);
    } else {
      alert('You must login to create posts');
    }
    setLoading(false);
    handleClose();
  };

  const showAnonUserMessage = () => alert('You must sign in to create posts');

  // Rendering

  const renderDropzoneOrImg = () => {
    if (!!base64) return <img src={base64} />;
    return <ImageDropzone onImageUpload={handleImageUpload} />;
  };

  const renderModalTrigger = (userIsLoggedIn: boolean) => {
    const content = props.triggerContent || 'Add Post';
    const clickHandler = userIsLoggedIn ? onOpen : showAnonUserMessage;
    switch (props.triggerType) {
      case 'button':
        return (
          <Button primary onClick={clickHandler}>
            {content}
          </Button>
        );
      case 'link':
        return (
          <div className="link" onClick={clickHandler} role="button">
            {content}
          </div>
        );
    }
  };

  return (
    <Modal
      className="create-post-modal"
      trigger={renderModalTrigger(stores.user.isLoggedIn)}
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

export default observer(CreatePostModal);
