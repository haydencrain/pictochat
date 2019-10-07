import * as React from 'react';
import { observer } from 'mobx-react';
import ThreadsSummaryList from '../ThreadsSummaryList/ThreadsSummaryList';
import RepliesList from '../RepliesList/RepliesList';
import ThreadListMenu from '../ThreadListMenu';
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
      <ThreadListMenu
        header={props.sectionHeader}
        createButtonMessage={props.addPostButtonMessage}
        parentId={props.id}
      />
      {postList}
    </section>
  );
}

export default observer(ThreadListContainer);
