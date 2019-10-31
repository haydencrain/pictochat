import * as React from 'react';
import { Segment } from 'semantic-ui-react';
import { DiscussionPost } from '../../../models/store/DiscussionPost';
import { PostTypes } from '../../../models/PostTypes';
import PostItem from '../PostItem';
import RepliesList from '../RepliesList/RepliesList';
import './PostsListItem.less';

interface PostListItemProps {
  /**
   * The post to display
   */
  post: DiscussionPost;
  /**
   * The type of post to display (Main, Root, or Reply)
   */
  postType: PostTypes;
  /**
   * Set to true if each post should display its replies (aka display the reply tree)
   */
  showReplies: boolean;
}

/**
 * A React component that renders a list item for the PostsList component
 * @param { PostListsProps } props - The props of the component
 */
function PostsListItem(props: PostListItemProps) {
  const renderPostReplies = () => {
    if (props.post.replies.length === 0 && !props.post.hasMore) {
      return null;
    }

    return (
      <div className="post-replies">
        <RepliesList postId={props.post.postId} raised={false} showReplies />
      </div>
    );
  };

  return (
    <Segment className="post-and-replies" data-postId={props.post.postId}>
      <PostItem post={props.post} postType={props.postType} />
      {props.showReplies && renderPostReplies()}
    </Segment>
  );
}

export default PostsListItem;
