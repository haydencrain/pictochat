import * as React from 'react';
import { observer } from 'mobx-react';
import StoresContext, { IStoresContext } from '../../contexts/StoresContext';
import ImageUploadModal from '../ImageUploadModal';
import { TriggerTypes } from '../ImageUploadModal/ImageUploadModal';
import { DiscussionPost } from '../../models/DiscussionPost';

interface EditPostModalProps {
  post: DiscussionPost;
  triggerType: TriggerTypes;
  triggerContent?: any;
}

function EditPostModal(props: EditPostModalProps) {
  const stores: IStoresContext = React.useContext(StoresContext);
  const shouldOpen = async (stores: IStoresContext) => (stores.user.isLoggedIn);

  const handleSubmit = async (image: File) => {
    await stores.discussion.updatePostImage(parseInt(props.post.postId), image);
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

export default observer(EditPostModal);
