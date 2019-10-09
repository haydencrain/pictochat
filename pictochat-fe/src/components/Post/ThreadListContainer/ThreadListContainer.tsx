import * as React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import ThreadsSummaryList from '../ThreadsSummaryList/ThreadsSummaryList';
import RepliesList from '../RepliesList/RepliesList';
import ThreadListMenu from '../ThreadListMenu';
import { SortValue } from '../../../models/SortTypes';
import StoresContext from '../../../contexts/StoresContext';
import { threadSummarySortOptions, repliesSortOptions } from './helpers';
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
  const store = React.useContext(StoresContext).discussion;

  // If no Id is present, then it's the main threads, otherwise it's the replies
  const isThreadsSummary = !props.id;

  const activeSort = computed(
    (): SortValue => {
      if (isThreadsSummary) {
        return store.threadSummariesActiveSort;
      }
      return store.activeDiscussionSort;
    }
  );

  const handleSortSelect = (sort: SortValue) => {
    if (isThreadsSummary) {
      store.setThreadSummariesActiveSort(sort);
    } else {
      store.setActiveDiscussionSort(sort);
    }
  };

  const postListProps = {
    noPostsMessage: props.noPostsMessage,
    showReplies: props.showReplies,
    raised: true
  };

  let postList = isThreadsSummary ? (
    <ThreadsSummaryList {...postListProps} />
  ) : (
    <RepliesList {...{ ...postListProps, ...{ postId: props.id } }} />
  );

  return (
    <section className="thread-list-container">
      <h1>{props.sectionHeader}</h1>
      <ThreadListMenu
        createButtonMessage={props.addPostButtonMessage}
        sortOptions={isThreadsSummary ? threadSummarySortOptions : repliesSortOptions}
        activeSort={activeSort.get()}
        onSortSelect={handleSortSelect}
        parentId={props.id}
      />
      {postList}
    </section>
  );
}

export default observer(ThreadListContainer);
