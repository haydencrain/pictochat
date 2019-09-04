import * as React from 'react';
import { useFetchPosts } from '../../hooks/PostsHooks';
import PostsList from '../PostsList';
import './ThreadListContainer.less';
import CreatePostModal from '../CreatePostModal/CreatePostModal';

interface ThreadListContinainerProps {
  id?: string;
  sectionHeader: string;
  noPostsMessage?: string;
  addPostButtonMessage?: string;
  showReplies?: boolean;
}

export default function ThreadListContainer(props: ThreadListContinainerProps) {
  const { id, sectionHeader, noPostsMessage, addPostButtonMessage } = props;
  const [posts, isLoading] = useFetchPosts(id);
  const showReplies = !!props.showReplies;
  return (
    <section className="thread-list-container">
      <div className="header">
        <h1>{sectionHeader}</h1>
        <CreatePostModal buttonContent={addPostButtonMessage} parentId={id} />
      </div>
      <PostsList isLoading={isLoading} posts={posts} noPostsMessage={noPostsMessage} raised showReplies={showReplies} />
    </section>
  );
}
