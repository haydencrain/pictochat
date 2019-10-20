import * as React from 'react';
import { observer } from 'mobx-react';
import ImageUploadModal, { TriggerTypes } from '../../Image/ImageUploadModal';
import StoresContext from '../../../contexts/StoresContext';
import ValidationException from '../../../models/exceptions/ValidationException';
import './EditPostModal.less';

interface EditPostModalProps {
  /**
   * The id of the post to edit
   */
  postId: string;
  /**
   * Determines whether the modal's trigger should either be a modal, or a link
   */
  triggerType: TriggerTypes;
  /**
   * The message the trigger should display
   */
  triggerContent?: any;
}

/**
 * React component that extends functionality of the ImageUploadModal.
 * This component will update a Post's image on submit.
 * @param { EditPostModalProps } props - The props of the component
 */
function EditPostModal(props: EditPostModalProps) {
  const stores = React.useContext(StoresContext);
  const activeDiscussionStore = stores.activeDiscussion;
  const authStore = stores.auth;

  const shouldOpen = () => authStore.isLoggedIn;

  const handleSubmit = async (image: File) => {
    try {
      await activeDiscussionStore.updatePostImage(parseInt(props.postId), image);
    } catch (error) {
      if (error.errorType == ValidationException.ERROR_TYPE) {
        alert('This post is no longer editable. This likely means that someone has reacted or replied to it');
        return;
      }
      throw error;
    }
  };

  return (
    <ImageUploadModal
      className="create-post-modal"
      triggerType={props.triggerType}
      triggerContent={props.triggerContent}
      onSubmit={handleSubmit}
      shouldOpen={shouldOpen}
    />
  );
}

export default observer(EditPostModal);
