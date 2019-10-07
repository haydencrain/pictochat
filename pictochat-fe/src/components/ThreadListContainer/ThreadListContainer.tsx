import * as React from 'react';
import { observer } from 'mobx-react';
import ThreadsSummaryList from '../ThreadsSummaryList/ThreadsSummaryList';
import RepliesList from '../RepliesList/RepliesList';
import ThreadListMenu from '../ThreadListMenu';
import './ThreadListContainer.less';
import { SortTypes, SortValue } from '../../models/SortTypes';
import StoresContext from '../../contexts/StoresContext';
import { computed } from 'mobx';

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
  let postListProps = {
    noPostsMessage: props.noPostsMessage,
    showReplies: props.showReplies,
    raised: true
  };

  // If no Id is present, then it's the main threads, otherwise it's the replies
  const isThreadsSummary = !props.id;

  const activeSort = computed(
    (): SortValue => {
      return isThreadsSummary ? store.threadSummariesActiveSort : SortTypes.NEW;
    }
  );

  const handleSortSelect = (sort: SortValue) => {
    if (isThreadsSummary) {
      store.setThreadSummariesActiveSort(sort);
    }
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
        activeSort={activeSort.get()}
        onSortSelect={handleSortSelect}
      />
      {postList}
    </section>
  );
}

export default observer(ThreadListContainer);
