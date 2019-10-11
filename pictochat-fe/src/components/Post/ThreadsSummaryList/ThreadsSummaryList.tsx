import * as React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import PostsList from '../PostsList';
import { PostTypes } from '../../../models/PostTypes';
import StoresContext from '../../../contexts/StoresContext';

interface ThreadsSummaryListProps {
  /**
   * Set true if the replies of each reply should be displayed (aka display the reply tree)
   */
  showReplies: boolean;
  /**
   * Message to be displayed when no posts are passed into the component
   */
  noPostsMessage: string;
  /**
   * Set to true if the segment containing the posts list should be raised
   */
  raised: boolean;
}

/**
 * A React component that fetches the main discussion posts, and passes the data into the PostsLists component
 * @param { ThreadsSummaryListProps } props - The props of the component
 */
function ThreadsSummaryList(props: ThreadsSummaryListProps) {
  const store = React.useContext(StoresContext).discussion;

  React.useEffect(() => {
    store.getNewDiscussions();
  }, []);

  const shouldLoadMore = computed((): boolean => {
    return store.hasMore;
  });

  const handleLoadMore = React.useCallback(() => {
    store.getMoreDiscussions();
  }, []);

  return (
    <PostsList
      isLoading={store.isLoading}
      posts={store.discussions}
      postsType={PostTypes.Root}
      noPostsMessage={props.noPostsMessage}
      raised={props.raised}
      showReplies={props.showReplies}
      shouldLoadMore={shouldLoadMore.get()}
      onLoadMore={handleLoadMore}
    />
  );
}

export default observer(ThreadsSummaryList);
