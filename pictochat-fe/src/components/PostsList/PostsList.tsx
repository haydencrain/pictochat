import * as React from 'react';
import { Segment } from 'semantic-ui-react';
import { DiscussionPost } from '../../models/DiscussionPost';
import Post from '../Post';
import PostReplies from '../PostReplies';
import './PostList.less';

interface Props {
  posts: DiscussionPost[];
  noPostsMessage?: string;
  showReplies: boolean;
  raised: boolean;
}

export default function PostsList(props: Props) {
  const { posts, showReplies, raised, noPostsMessage } = props;

  const renderNoPosts = () =>
    !!noPostsMessage && (
      <Segment>
        <p>{noPostsMessage}</p>
      </Segment>
    );

  const renderPosts = () =>
    posts.map(post => (
      <Segment className="post-and-replies" key={post.postId}>
        <Post post={post} />
        {showReplies && <PostReplies replies={post.replies || []} />}
      </Segment>
    ));

  return (
    <Segment.Group className="post-list" raised={raised}>
      {posts.length === 0 ? renderNoPosts() : renderPosts()}
    </Segment.Group>
  );
}
