import * as React from 'react';
import { Modal, Button, Loader, Dimmer } from 'semantic-ui-react';
import * as cookies from 'js-cookie';
import StoresContext from '../../contexts/StoresContext';
import { useImage } from '../../hooks/ImageHooks';
import ImageDropzone from '../ImageDropzone';
import { useToggleModal } from '../../hooks/ModalHooks';
import NewPostPayload from '../../models/NewPostPayload';
import { DiscussionService } from '../../services/DiscussionService';
import './CreatePostModal.less';
import ApiService from '../../services/ApiService';


type TriggerTypes = 'button' | 'link';

interface CreatePostModalProps {
  triggerType: TriggerTypes;
  triggerContent?: any;
  parentPostId?: string;
}

export default function CreatePostModal(props: CreatePostModalProps) {
  console.log('RENDER CreatePostModal, Props: ', props);
  // const { triggerType, triggerContent, parentId } = props;
  const stores = React.useContext(StoresContext);
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
  const handleSubmit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    // FIXME: get current user from auth when implemented
    // const user = { userId: '1' }; // getCurrentUser();
    if (cookies.get('pictochatJWT')) {
      let user = await ApiService.get('/user/authed');
      console.log("USER: ", user);
      const data: NewPostPayload = {
        userId: user.userId,
        // userId: stores.user.currentUser.userId,
        parentPostId: props.parentPostId || null,
        image: image
      };
      await stores.discussion.createPost(data);
    } else {
      alert("You must login to create posts");
    }
    setLoading(false);
    handleClose();
  };

  const renderDropzoneOrImg = () => {
    if (!!base64) return <img src={base64} />;
    return <ImageDropzone onImageUpload={handleImageUpload} />;
  };

  const renderModalTrigger = () => {
    const content = props.triggerContent || 'Add Post';
    switch (props.triggerType) {
      case 'button':
        return (
          <Button primary onClick={onOpen}>
            {content}
          </Button>
        );
      case 'link':
        return (
          <div className="link" onClick={onOpen}>
            {content}
          </div>
        );
    }
  };

  return (
    <Modal
      className="create-post-modal"
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
