import * as React from 'react';
import { observer, useObserver } from 'mobx-react';
import StoresContext, { IStoresContext } from '../../contexts/StoresContext';
// import { useFetchPosts } from '../../hooks/PostsHooks';
import PostsList from '../PostsList';
import CreatePostModal from '../CreatePostModal/CreatePostModal';
import { PostTypes } from '../../models/PostTypes';
import './ThreadListContainer.less';
import DiscussionStore from '../../stores/DiscussionStore';

//// THREADS LIST CONTAINER /////

interface ThreadListContainerProps {
  id?: string;
  sectionHeader: string;
  noPostsMessage?: string;
  addPostButtonMessage?: string;
  showReplies?: boolean;
}

function ThreadListContainer(props: ThreadListContainerProps) {
  // const [posts, isLoading] = useFetchPosts(props.id);
  const stores = React.useContext(StoresContext)

  let postListProps = { stores: stores, noPostsMessage: props.noPostsMessage, showReplies: props.showReplies };
  // If no Id is present, then it's the main threads, otherwise it's the replies
  let postList = (!props.id)
    ? <ThreadsSummaryList {...postListProps} />
    : <RepliesList {...{ ...postListProps, ...{ store: stores.discussion, postId: props.id } }} />;

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
  postId: string,
  store: DiscussionStore,
  showReplies: boolean,
  noPostsMessage: string
}) {
  if (props.store.isLoadingActiveDiscussion) {
    console.log('Still loading? ', props.store.isLoadingActiveDiscussion);
    return null;
  }
  console.log('Finished loading? ', !props.store.isLoadingActiveDiscussion);
  console.log('ROOT POST(', props.postId, '): ', props.store.activeDiscussionPosts);
  return (
    <PostsList
      isLoading={props.store.isLoadingActiveDiscussion}
      posts={props.store.activeDiscussionPosts.get(parseInt(props.postId)).replies}
      postsType={PostTypes.Reply}
      noPostsMessage={props.noPostsMessage}
      raised
      showReplies={props.showReplies}
    />
  );
});

const ThreadsSummaryList = observer(function ThreadsSummaryList(props: {
  stores: IStoresContext, showReplies: boolean, noPostsMessage: string
}) {
  return (
    <PostsList
      isLoading={props.stores.discussion.isLoadingThreads}
      posts={props.stores.discussion.threadSummaries}
      postsType={PostTypes.Root}
      noPostsMessage={props.noPostsMessage}
      raised
      showReplies={props.showReplies}
    />
  );
});
