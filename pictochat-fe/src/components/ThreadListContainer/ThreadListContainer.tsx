import * as React from 'react';
import { useFetchPosts } from '../../hooks/PostsHooks';
import PostsList from '../PostsList';
import './ThreadListContainer.less';

interface ThreadListContinainerProps {
  id?: string;
  sectionHeader: string;
  noPostsMessage: string;
  showReplies?: boolean;
}

export default function ThreadListContainer(props: ThreadListContinainerProps) {
  const { id, sectionHeader, noPostsMessage } = props;
  const showReplies = !!props.showReplies;
  const [posts, isLoading] = useFetchPosts(id);
  return (
    <section className="thread-list-container">
      <h1>{sectionHeader}</h1>
      <PostsList isLoading={isLoading} posts={posts} noPostsMessage={noPostsMessage} raised showReplies={showReplies} />
    </section>
  );
}
