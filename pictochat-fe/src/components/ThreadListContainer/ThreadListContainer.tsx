import * as React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import StoresContext from '../../contexts/StoresContext';
import PostsList from '../PostsList';
import CreatePostModal from '../CreatePostModal/CreatePostModal';
import { PostTypes } from '../../models/PostTypes';
import DiscussionStore from '../../stores/DiscussionStore';
import { DiscussionPost } from '../../models/DiscussionPost';
import ThreadsSummaryList from '../ThreadsSummaryList/ThreadsSummaryList';
import './ThreadListContainer.less';
import RepliesList from '../RepliesList/RepliesList';

//// THREADS LIST CONTAINER /////

interface ThreadListContainerProps {
  id?: string;
  sectionHeader: string;
  noPostsMessage?: string;
  addPostButtonMessage?: string;
  showReplies?: boolean;
}

function ThreadListContainer(props: ThreadListContainerProps) {
  let postListProps = {
    noPostsMessage: props.noPostsMessage,
    showReplies: props.showReplies,
    raised: true
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
