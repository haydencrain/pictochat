import * as React from 'react';
import { observer } from 'mobx-react';
import { Segment } from 'semantic-ui-react';
import { DiscussionPost } from '../../../models/DiscussionPost';
import { PostTypes } from '../../../models/PostTypes';
import PostItem from '../PostItem';
import RepliesList from '../RepliesList/RepliesList';
import './PostsListItem.less';

interface PostListItemProps {
  post: DiscussionPost;
  postType: PostTypes;
  showReplies: boolean;
}

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
    <Segment className="post-and-replies">
      <PostItem post={props.post} postType={props.postType} />
      {props.showReplies && renderPostReplies()}
    </Segment>
  );
}

export default observer(PostsListItem);
