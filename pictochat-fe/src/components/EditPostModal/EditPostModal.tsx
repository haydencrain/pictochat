import * as React from 'react';
import { observer } from 'mobx-react';
import StoresContext, { IStoresContext } from '../../contexts/StoresContext';
import ImageUploadModal from '../ImageUploadModal';
import { TriggerTypes } from '../ImageUploadModal/ImageUploadModal';
import { DiscussionPost } from '../../models/DiscussionPost';
import ValidationException from '../../models/ValidationException';

interface EditPostModalProps {
  postId: string;
  triggerType: TriggerTypes;
  triggerContent?: any;
}

function EditPostModal(props: EditPostModalProps) {
  const stores: IStoresContext = React.useContext(StoresContext);
  const shouldOpen = async (stores: IStoresContext) => stores.user.isLoggedIn;

  const handleSubmit = async (image: File) => {
    try {
      await stores.discussion.updatePostImage(parseInt(props.postId), image);
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

export default EditPostModal;
// export default observer(EditPostModal);
