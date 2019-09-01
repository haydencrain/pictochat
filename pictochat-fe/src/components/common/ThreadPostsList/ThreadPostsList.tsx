import * as React from 'react';
import { Segment } from 'semantic-ui-react';
import { DiscussionPost } from '../../../models/DiscussionPost';
import ThreadPost from '../ThreadPost';

interface Props {
  posts: DiscussionPost[];
  showReplies?: boolean;
  raised?: boolean;
}

export default function ThreadPostsList(props: Props) {
  const { posts, showReplies } = props;
  const raised = props.raised === undefined || props.raised;
  return (
    <Segment.Group raised={raised}>
      {posts.map(post => (
        <Segment key={post.postId}>
          <ThreadPost post={post} showReplies={showReplies} />
        </Segment>
      ))}
    </Segment.Group>
  );
}
