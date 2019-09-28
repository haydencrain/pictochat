import * as React from 'react';
import { observer } from 'mobx-react';
import StoresContext, { IStoresContext } from '../../contexts/StoresContext';
import NavHistoryContext from '../../contexts/NavHistoryContext';
import './DeletePostButton.less';

interface DeletePostButtonProps {
  postId: string;
  // onDidDelete?: (stores: IStoresContext, postId: string) => Promise<void>;
}

function DeletePostButton(props: DeletePostButtonProps) {
  const stores = React.useContext(StoresContext);
  // FIXME: Figure out a robust way of allowing caller to handle root post deletion
  // (e.g. so we don't just show Loaders forever on discussion page)
  const history = React.useContext(NavHistoryContext);

  const handleClick = async () => {
    const post = stores.discussion.activeDiscussionPosts.get(props.postId);
    console.log('BEFORE: ', JSON.stringify(post));
    const isRoot = post.isRootPost;
    await stores.discussion.deletePost(parseInt(props.postId));
    console.log('AFTER: ', JSON.stringify(post));
    if (isRoot && !post.isHidden) {
      history.goBack();
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

export default observer(DeletePostButton);
