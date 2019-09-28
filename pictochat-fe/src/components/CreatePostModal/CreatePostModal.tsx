import * as React from 'react';
import { observer } from 'mobx-react';
import StoresContext, { IStoresContext } from '../../contexts/StoresContext';
import ImageUploadModal from '../ImageUploadModal';
import { TriggerTypes } from '../ImageUploadModal/ImageUploadModal';
import NewPostPayload from '../../models/NewPostPayload';
import { User } from '../../models/User';
import './CreatePostModal.less';

interface CreatePostModalProps {
  parentPostId?: string;
  triggerType: TriggerTypes;
  triggerContent?: any;
}

function CreatePostModal(props: CreatePostModalProps) {
  const stores: IStoresContext = React.useContext(StoresContext);
  const currentUser: User = stores.user.currentUser;
  const shouldOpen = async (stores: IStoresContext) => {
    if (stores.user.isLoggedIn) {
      return true;
    }
    alert('You must be logged in to post');
    return false;
  };

  const handleSubmit = async (image: File) => {
    if (stores.user.isLoggedIn && !stores.user.isLoading) {
      const data: NewPostPayload = {
        userId: currentUser.userId,
        parentPostId: props.parentPostId || null,
        image: image
      };
      await stores.discussion.createPost(data);
    }
  };

  return (
    // ts complains that className isn't a property of ImageUploadModal
    // @ts-ignore
    <ImageUploadModal
      className="create-post-modal"
      triggerType={props.triggerType}
      triggerContent={props.triggerContent}
      onSubmit={handleSubmit}
      shouldOpen={shouldOpen}
    />
  );
}

// function CreatePostModalV1(props: CreatePostModalProps) {
//   // Data
//   const stores = React.useContext(StoresContext);
//   const currentUser: User = stores.user.currentUser;

//   // Hooks
//   const { isActive, onOpen, onClose } = useToggleModal();
//   const [isLoading, setLoading] = React.useState(false);
//   const { image, base64, addNewImage, clearImage } = useImage({
//     onSetImageDone: () => setLoading(false)
//   });

//   // Callbacks
//   const handleImageUpload = (file: File) => {
//     setLoading(true);
//     addNewImage(file);
//   };
//   const handleClose = () => {
//     clearImage();
//     onClose();
//   };
//   const handleSubmit = async (e: React.BaseSyntheticEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     if (stores.user.isLoggedIn && !stores.user.isLoading) {
//       const data: NewPostPayload = {
//         userId: currentUser.userId,
//         parentPostId: props.parentPostId || null,
//         image: image
//       };
//       await stores.discussion.createPost(data);
//     }
//     // else {
//     //   alert('You must login to create posts');
//     // }
//     setLoading(false);
//     handleClose();
//   };

//   const showAnonUserMessage = () => alert('You must sign in to create posts');

//   // Rendering

//   const renderDropzoneOrImg = () => {
//     if (!!base64) return <img src={base64} />;
//     return <ImageDropzone onImageUpload={handleImageUpload} />;
//   };

//   const renderModalTrigger = (userIsLoggedIn: boolean) => {
//     const content = props.triggerContent || 'Add Post';
//     const clickHandler = userIsLoggedIn ? onOpen : showAnonUserMessage;
//     switch (props.triggerType) {
//       case 'button':
//         return (
//           <Button primary onClick={clickHandler}>
//             {content}
//           </Button>
//         );
//       case 'link':
//         return (
//           <div className="link" onClick={clickHandler} role="button">
//             {content}
//           </div>
//         );
//     }
//   };

//   return (
//     <Modal
//       className="create-post-modal"
//       trigger={renderModalTrigger(stores.user.isLoggedIn)}
//       open={isActive}
//       onClose={handleClose}
//       closeIcon={false}
//     >
//       <Modal.Header>Upload an Image</Modal.Header>
//       <Modal.Content className="modal-content">{renderDropzoneOrImg()}</Modal.Content>

//       <Modal.Actions>
//         <Button onClick={handleClose}>Cancel</Button>
//         <Button primary onClick={handleSubmit}>
//           Submit
//         </Button>
//       </Modal.Actions>

//       <Dimmer inverted active={isLoading}>
//         <Loader />
//       </Dimmer>
//     </Modal>
//   );
// }

export default observer(CreatePostModal);
