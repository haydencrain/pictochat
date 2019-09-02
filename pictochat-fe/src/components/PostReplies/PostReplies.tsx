import * as React from 'react';
import { DiscussionPost } from '../../models/DiscussionPost';
import PostsList from '../PostsList';
import './PostReplies.less';

interface PostRepliesProps {
  replies: DiscussionPost[];
  raised?: boolean;
}

export default function PostReplies(props: PostRepliesProps) {
  const { replies } = props;
  const raised = !!props.raised;
  if (!replies.length) return null;
  return (
    <div className="post-replies">
      <PostsList posts={replies} raised={raised} showReplies />
    </div>
  );
}
