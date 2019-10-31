import React from 'react';
import { observer } from 'mobx-react-lite';
import ImageUploadModal, { TriggerTypes } from '../../Image/ImageUploadModal';
import StoresContext from '../../../contexts/StoresContext';
import NewPostPayload from '../../../models/NewPostPayload';
import './CreatePostModal.less';

interface CreatePostModalProps {
  /**
   * If no id is present, this component assumes that the new post is a new Discussion post.
   * Otherwise, it is considered to be a new Reply post.
   */
  parentPostId?: string;
  /**
   * Determines whether the modal's trigger should either be a modal, or a link
   */
  triggerType: TriggerTypes;
  /**
   * The message the trigger should display
   */
  triggerContent?: any;
  triggerClassName?: string;
}

/**
 * React component that extends functionality of the ImageUploadModal.
 * This component will create a new Post when the image is submitted.
 * @param { CreatePostModalProps } props - The props of the component
 */
function CreatePostModal(props: CreatePostModalProps) {
  const stores = React.useContext(StoresContext);
  const authStore = stores.auth;
  const discussionStore = stores.discussion;
  const activeDiscussionStore = stores.activeDiscussion;
  const currentUser = authStore.currentUser;
  const shouldOpen = () => {
    if (authStore.isLoggedIn) {
      return true;
    }
    alert('You must be logged in to post');
    return false;
  };

  const handleSubmit = async (image: File) => {
    if (authStore.isLoggedIn && !authStore.isLoading) {
      const data: NewPostPayload = {
        userId: currentUser.userId,
        parentPostId: props.parentPostId || null,
        image: image
      };
      if (!data.parentPostId) {
        discussionStore.createDiscussion(data);
      } else {
        activeDiscussionStore.createReply(data);
      }
    }
  };

  return (
    <ImageUploadModal
      className="create-post-modal"
      triggerType={props.triggerType}
      triggerContent={props.triggerContent}
      onSubmit={handleSubmit}
      shouldOpen={shouldOpen}
      triggerClassName={props.triggerClassName}
    />
  );
}

export default observer(CreatePostModal);
