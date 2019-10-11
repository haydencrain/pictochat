import * as React from 'react';
import { observer } from 'mobx-react';
import ImageUploadModal, { TriggerTypes } from '../../Image/ImageUploadModal';
import StoresContext, { IStoresContext } from '../../../contexts/StoresContext';
import ValidationException from '../../../models/exceptions/ValidationException';
import './EditPostModal.less';

interface EditPostModalProps {
  postId: string;
  triggerType: TriggerTypes;
  triggerContent?: any;
}

function EditPostModal(props: EditPostModalProps) {
  const activeDiscussionStore = React.useContext(StoresContext).activeDiscussion;
  const shouldOpen = async (stores: IStoresContext) => stores.auth.isLoggedIn;

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
    // FIXME: ts complains that className isn't a property of ImageUploadModal
    //        (Solution?: figure out what type we need to cast ImageUploadModal to when exporting)
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

export default observer(EditPostModal);
