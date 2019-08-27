import * as React from 'react';
import { Segment } from 'semantic-ui-react';
import { DiscussionPost } from '../../../model/DiscussionPost';
import ThreadPost from '../ThreadPost';

interface Props {
  posts: DiscussionPost[];
  raised?: boolean;
}

export default function ThreadPostsList(props: Props) {
  const { posts } = props;
  const raised = props.raised === undefined || props.raised;
  return (
    <Segment.Group raised={raised}>
      {posts.map(post => (
        <Segment key={post.postId}>
          <ThreadPost post={post} />
        </Segment>
      ))}
    </Segment.Group>
  );
}
