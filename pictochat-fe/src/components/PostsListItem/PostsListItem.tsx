import * as React from 'react';
import { Segment } from 'semantic-ui-react';
import { DiscussionPost } from '../../models/DiscussionPost';
import { PostTypes } from '../../models/PostTypes';
import PostsList from '../PostsList';
import Post from '../Post';
import './PostsListItem.less';

interface PostListItemProps {
  post: DiscussionPost;
  postType: PostTypes;
  showReplies: boolean;
}

export default function PostsListItem(props: PostListItemProps) {
  const { post, postType, showReplies } = props;
  const replies = post.replies || [];

  const renderPostReplies = () =>
    replies.length > 0 && (
      <div className="post-replies">
        <PostsList postsType={PostTypes.Reply} posts={replies} raised={false} showReplies />
      </div>
    );

  return (
    <Segment className="post-and-replies">
      <Post post={post} postType={postType} />
      {showReplies && renderPostReplies()}
    </Segment>
  );
}
