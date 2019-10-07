import * as React from 'react';
import { observer } from 'mobx-react';
import StoresContext from '../../contexts/StoresContext';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import './DeletePostButton.less';

interface DeletePostButtonProps extends RouteComponentProps<any> {
  postId: string;
  // onDidDelete?: (stores: IStoresContext, postId: string) => Promise<void>;
}

function DeletePostButton(props: DeletePostButtonProps) {
  const stores = React.useContext(StoresContext);

  const handleClick = async () => {
    const post = stores.discussion.activeDiscussionPosts.get(props.postId);
    console.log('BEFORE: ', JSON.stringify(post));
    const isRoot = post.isRootPost;
    await stores.discussion.deletePost(parseInt(props.postId));
    console.log('AFTER: ', JSON.stringify(post));
    if (isRoot && !post.isHidden) {
      props.history.goBack();
    }
    // if (props.onDidDelete) {
    //   await props.onDidDelete(stores, props.postId);
    // }
  };

  return (
    <button className="link" onClick={handleClick}>
      delete
    </button>
  );
}

export default observer(withRouter(DeletePostButton));
