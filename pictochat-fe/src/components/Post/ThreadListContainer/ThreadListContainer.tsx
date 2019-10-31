import * as React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import ThreadsSummaryList from '../ThreadsSummaryList/ThreadsSummaryList';
import RepliesList from '../RepliesList/RepliesList';
import ThreadListMenu, { threadSummarySortOptions, repliesSortOptions } from '../ThreadListMenu';
import { SortValue } from '../../../models/SortTypes';
import StoresContext from '../../../contexts/StoresContext';
import './ThreadListContainer.less';

interface ThreadListContainerProps {
  /**
   * The post id of for the thread list. If no id is present, then it's the main threads, otherwise it's the replies
   */
  id?: string;
  /**
   * The header to display within the section
   */
  sectionHeader: string;
  /**
   * The message to display if no posts are present
   */
  noPostsMessage?: string;
  /**
   * The text of the button that is Present within the menu, which is used to create a new post
   */
  addPostButtonMessage?: string;
  /**
   * Set true if the replies of each reply should be displayed (aka display the reply tree)
   */
  showReplies?: boolean;

  htmlId?: string;
}

/**
 * A React component that provides a section for loading, display and sorting a list of threads (posts). This component
 * can be used for either displaying the Main threads, or to display a thread's replies.
 * @param { ThreadListContainerProps } props - The props of the component
 */
function ThreadListContainer(props: ThreadListContainerProps) {
  /* STORES */
  const store = React.useContext(StoresContext);
  const discussionStore = store.discussion;
  const activeDiscussionStore = store.activeDiscussion;

  // If no Id is present, then it's the main threads, otherwise it's the replies
  const isThreadsSummary = !props.id;
  const activeSort = computed((): SortValue => (isThreadsSummary ? discussionStore.sort : activeDiscussionStore.sort));
  const setSort = isThreadsSummary ? discussionStore.setSort : activeDiscussionStore.setSort;

  /* CALLBACKS */

  const handleSortSelect = (sort: SortValue) => {
    setSort(sort);
  };

  /* RENDERING */

  const postListProps = {
    noPostsMessage: props.noPostsMessage,
    showReplies: props.showReplies,
    raised: true,
    htmlId: props.htmlId
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
