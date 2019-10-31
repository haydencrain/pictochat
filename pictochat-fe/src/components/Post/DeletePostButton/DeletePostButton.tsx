import * as React from 'react';
import { observer } from 'mobx-react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import StoresContext from '../../../contexts/StoresContext';
import './DeletePostButton.less';

interface DeletePostButtonProps extends RouteComponentProps<any> {
  /**
   * The id of the post to delete (once the button is pressed)
   */
  postId: string;
}

/**
 * React component that provides a button that will delete a post on click
 * @param { DeletePostButtonProps } props - The props of the component
 */
function DeletePostButton(props: DeletePostButtonProps) {
  const activeDiscussionStore = React.useContext(StoresContext).activeDiscussion;

  const handleClick = async () => {
    const post = activeDiscussionStore.postsMap.get(props.postId);
    const isRoot = post.isRootPost;
    await activeDiscussionStore.deletePost(parseInt(props.postId));
    if (isRoot && !post.isHidden) {
      props.history.goBack();
    }
  };

  return (
    <button className="link delete-post" onClick={handleClick}>
      delete
    </button>
  );
}

export default observer(withRouter(DeletePostButton));
