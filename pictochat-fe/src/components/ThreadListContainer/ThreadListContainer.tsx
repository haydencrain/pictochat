import * as React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import StoresContext from '../../contexts/StoresContext';
import PostsList from '../PostsList';
import CreatePostModal from '../CreatePostModal/CreatePostModal';
import { PostTypes } from '../../models/PostTypes';
import DiscussionStore from '../../stores/DiscussionStore';
import { Loader } from 'semantic-ui-react';
import { DiscussionPost } from '../../models/DiscussionPost';
import './ThreadListContainer.less';

//// THREADS LIST CONTAINER /////

interface ThreadListContainerProps {
  id?: string;
  sectionHeader: string;
  noPostsMessage?: string;
  addPostButtonMessage?: string;
  showReplies?: boolean;
}

function ThreadListContainer(props: ThreadListContainerProps) {
  const stores = React.useContext(StoresContext);

  let postListProps = {
    store: stores.discussion,
    noPostsMessage: props.noPostsMessage,
    showReplies: props.showReplies
  };
  // If no Id is present, then it's the main threads, otherwise it's the replies
  let postList = !props.id ? (
    <ThreadsSummaryList {...postListProps} />
  ) : (
    <RepliesList {...{ ...postListProps, ...{ postId: props.id } }} />
  );

  return (
    <section className="thread-list-container">
      <div className="thread-list-header">
        <h1>{props.sectionHeader}</h1>
        <CreatePostModal triggerType="button" triggerContent={props.addPostButtonMessage} parentPostId={props.id} />
      </div>
      {postList}
    </section>
  );
}

export default observer(ThreadListContainer);

//// HELPER COMPONENTS ////

const RepliesList = observer(function RepliesList(props: {
  postId: string;
  store: DiscussionStore;
  showReplies: boolean;
  noPostsMessage: string;
}) {
  const { postId, store, showReplies, noPostsMessage } = props;

  const posts = computed((): DiscussionPost[] => {
    return store.activeDiscussionPosts.has(postId) ? store.activeDiscussionPosts.get(postId).replies : [];
  });

  const isLoading = computed((): boolean => {
    return store.isLoadingActiveDiscussion || !store.activeDiscussionPosts.has(postId);
  });

  if (isLoading.get()) {
    return <Loader />;
  }

  return (
    <PostsList
      isLoading={isLoading.get()}
      posts={posts.get()}
      postsType={PostTypes.Reply}
      noPostsMessage={noPostsMessage}
      raised
      showReplies={showReplies}
    />
  );
});

const ThreadsSummaryList = observer(function ThreadsSummaryList(props: {
  store: DiscussionStore;
  showReplies: boolean;
  noPostsMessage: string;
}) {
  React.useEffect(() => {
    props.store.getNewThreadSummaries();
  }, []);

  const shouldLoadMore = computed((): boolean => {
    return props.store.threadSummariesHasMore;
  });

  const handleLoadMore = React.useCallback(() => {
    props.store.getMoreThreadSummaries();
  }, []);

  return (
    <PostsList
      isLoading={props.store.isLoadingThreads}
      posts={props.store.threadSummaries}
      postsType={PostTypes.Root}
      noPostsMessage={props.noPostsMessage}
      raised
      showReplies={props.showReplies}
      shouldLoadMore={shouldLoadMore.get()}
      onLoadMore={handleLoadMore}
    />
  );
});
