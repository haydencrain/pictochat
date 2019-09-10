import * as React from 'react';
import { useFetchPosts } from '../../hooks/PostsHooks';
import PostsList from '../PostsList';
import CreatePostModal from '../CreatePostModal/CreatePostModal';
import { PostTypes } from '../../models/PostTypes';
import './ThreadListContainer.less';

interface ThreadListContainerProps {
  id?: string;
  sectionHeader: string;
  noPostsMessage?: string;
  addPostButtonMessage?: string;
  showReplies?: boolean;
}

export default function ThreadListContainer(props: ThreadListContainerProps) {
  const { id, sectionHeader, noPostsMessage, addPostButtonMessage } = props;
  const [posts, isLoading] = useFetchPosts(id);
  const showReplies = !!props.showReplies;
  // If no Id is present, then it's the main threads, otherwise it's the replies
  const postsType = !id ? PostTypes.Root : PostTypes.Reply;
  return (
    <section className="thread-list-container">
      <div className="thread-list-header">
        <h1>{sectionHeader}</h1>
        <CreatePostModal triggerType="button" triggerContent={addPostButtonMessage} parentId={id} />
      </div>
      <PostsList
        isLoading={isLoading}
        posts={posts}
        postsType={postsType}
        noPostsMessage={noPostsMessage}
        raised
        showReplies={showReplies}
      />
    </section>
  );
}
