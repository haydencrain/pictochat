import React from 'react';
import { observer } from 'mobx-react-lite';
import ImageUploadModal, { TriggerTypes } from '../../Image/ImageUploadModal';
import StoresContext, { IStoresContext } from '../../../contexts/StoresContext';
import User from '../../../models/store/User';
import NewPostPayload from '../../../models/NewPostPayload';
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
    // FIXME: configure ImageUploadModal to allow classNames to be added
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

export default observer(CreatePostModal);
