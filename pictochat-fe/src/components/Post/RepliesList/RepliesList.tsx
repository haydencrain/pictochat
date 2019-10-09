import * as React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { DiscussionPost } from '../../../models/store/DiscussionPost';
import { PostTypes } from '../../../models/PostTypes';
import PostsList from '../PostsList';
import StoresContext from '../../../contexts/StoresContext';

interface RepliesListProps {
  postId: string;
  showReplies: boolean;
  noPostsMessage?: string;
  raised: boolean;
}

function RepliesList(props: RepliesListProps) {
  const store = React.useContext(StoresContext).discussion;
  const { postId, showReplies, noPostsMessage } = props;

  const post = computed(
    (): DiscussionPost => {
      return store.activeDiscussionPosts.has(postId) ? store.activeDiscussionPosts.get(postId) : new DiscussionPost();
    }
  );

  const hasMore = computed((): boolean => {
    return store.activeDiscussionPosts.has(postId) ? store.activeDiscussionPosts.get(postId).hasMore : false;
  });

  const posts = computed((): DiscussionPost[] => {
    return store.activeDiscussionPosts.has(postId) ? store.activeDiscussionPosts.get(postId).replies : [];
  });

  const isLoading = computed((): boolean => {
    return store.isLoadingReplies || !store.activeDiscussionPosts.has(postId);
  });

  const handleLoadMore = () => {
    const currentPost = post.get();
    const after = currentPost.replies.length > 0 ? currentPost.replies[currentPost.replies.length - 1].postId : null;
    store.getExtraReplies(currentPost.postId, after);
  };

  return (
    <PostsList
      isLoading={isLoading.get()}
      posts={posts.get()}
      postsType={PostTypes.Reply}
      noPostsMessage={noPostsMessage}
      raised={props.raised}
      showReplies={showReplies}
      shouldLoadMore={hasMore.get()}
      onLoadMore={handleLoadMore}
    />
  );
}

export default observer(RepliesList);
