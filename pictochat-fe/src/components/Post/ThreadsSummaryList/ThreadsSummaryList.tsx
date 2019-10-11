import * as React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import PostsList from '../PostsList';
import { PostTypes } from '../../../models/PostTypes';
import StoresContext from '../../../contexts/StoresContext';

interface ThreadsSummaryListProps {
  showReplies: boolean;
  noPostsMessage: string;
  raised: boolean;
}

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
