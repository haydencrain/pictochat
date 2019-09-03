import * as React from 'react';
import { Segment } from 'semantic-ui-react';
import { DiscussionPost } from '../../models/DiscussionPost';
import Post from '../Post';
import PostReplies from '../PostReplies';
import './PostList.less';

interface Props {
  posts: DiscussionPost[];
  showReplies: boolean;
  raised: boolean;
}

export default function PostsList(props: Props) {
  const { posts, showReplies, raised } = props;

  return (
    <Segment.Group className="post-list" raised={raised}>
      {posts.map(post => (
        <Segment key={post.postId}>
          <Post post={post} />
          {showReplies && <PostReplies replies={post.replies || []} />}
        </Segment>
      ))}
    </Segment.Group>
  );
}
