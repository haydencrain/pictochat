import * as React from 'react';
import { observer } from 'mobx-react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import StoresContext from '../../../contexts/StoresContext';
import './DeletePostButton.less';

interface DeletePostButtonProps extends RouteComponentProps<any> {
  postId: string;
  // onDidDelete?: (stores: IStoresContext, postId: string) => Promise<void>;
}

function DeletePostButton(props: DeletePostButtonProps) {
  const discussionStore = React.useContext(StoresContext).discussion;

  // TODO: pass the handle Delete method up to a higher component in order to increase modularity
  const handleClick = async () => {
    const post = discussionStore.activeDiscussionPosts.get(props.postId);
    console.log('BEFORE: ', JSON.stringify(post));
    const isRoot = post.isRootPost;
    await discussionStore.deletePost(parseInt(props.postId));
    console.log('AFTER: ', JSON.stringify(post));
    if (isRoot && !post.isHidden) {
      props.history.goBack();
    }
  };

  return (
    <button className="link" onClick={handleClick}>
      delete
    </button>
  );
}

export default observer(withRouter(DeletePostButton));
