import * as React from 'react';
import { Segment, Dimmer, Loader } from 'semantic-ui-react';
import { DiscussionPost } from '../../models/DiscussionPost';
import Post from '../Post';
import PostReplies from '../PostReplies';
import './PostList.less';

interface Props {
  posts: DiscussionPost[];
  noPostsMessage?: string;
  isLoading?: boolean;
  showReplies: boolean;
  raised: boolean;
}

export default function PostsList(props: Props) {
  const { posts, showReplies, raised, noPostsMessage, isLoading } = props;

  const renderLoading = () => (
    <Segment className="post-list-loading">
      <Loader active />
    </Segment>
  );

  const renderNoPosts = () => (
    <Segment>
      <p>{noPostsMessage || 'Nothing to display'}</p>
    </Segment>
  );

  const renderPosts = () =>
    posts.map(post => (
      <Segment className="post-and-replies" key={post.postId}>
        <Post post={post} />
        {showReplies && <PostReplies replies={post.replies || []} />}
      </Segment>
    ));

  const renderContent = () => {
    if (!!isLoading) return renderLoading();
    if (posts.length > 0) return renderPosts();
    return renderNoPosts();
  };

  return (
    <Segment.Group className="post-list" raised={raised}>
      {renderContent()}
    </Segment.Group>
  );
}
