import * as React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { DiscussionPost } from '../../../models/store/DiscussionPost';
import { PostTypes } from '../../../models/PostTypes';
import PostsList from '../PostsList';
import StoresContext from '../../../contexts/StoresContext';

interface RepliesListProps {
  /**
   * The id of the post to get the replies from
   */
  postId: string;
  /**
   * Set true if the replies of each reply should be displayed (aka display the reply tree)
   */
  showReplies: boolean;
  /**
   * Message to be displayed when no posts are passed into the component
   */
  noPostsMessage?: string;
  /**
   * Set to true if the segment containing the posts list should be raised
   */
  raised: boolean;

  htmlId?: string;
}

/**
 * A React component that fetches the replies of a post, and passes the data into the PostsLists component
 * @param { RepliesListProps } props - The props of the component
 */
function RepliesList(props: RepliesListProps) {
  const store = React.useContext(StoresContext).activeDiscussion;
  const { postId, showReplies, noPostsMessage } = props;

  const post = computed(
    (): DiscussionPost => {
      return store.postsMap.has(postId) ? store.postsMap.get(postId) : new DiscussionPost();
    }
  );

  const hasMore = computed((): boolean => {
    return store.postsMap.has(postId) ? store.postsMap.get(postId).hasMore : false;
  });

  const posts = computed((): DiscussionPost[] => {
    return store.postsMap.has(postId) ? store.postsMap.get(postId).replies : [];
  });

  const isLoading = computed((): boolean => {
    return store.isLoadingReplies || !store.postsMap.has(postId);
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
      htmlId={props.htmlId}
    />
  );
}

export default observer(RepliesList);
