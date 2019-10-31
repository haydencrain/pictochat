import * as React from 'react';
import { computed } from 'mobx';
import { Observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router';
import StoresContext, { IStoresContext } from '../../contexts/StoresContext';
import ThreadListContainer from '../../components/Post/ThreadListContainer';
import PostMainContainer from '../../components/Post/PostMainContainer';
import './DiscussionPage.less';

export const REPLY_PLACEHOLDER_TEXT = 'No replies have been added yet! Be the first to add a reply!';

interface DiscussionPageMatchParams {
  /**
   * The id of the discussion, from the url route params
   */
  id: string;
}

interface DiscussionPageProps extends RouteComponentProps<DiscussionPageMatchParams> {}

/**
 * A React component that fetches the currently selected discussion (by access the url's route parameters) and rendering
 * Page layout for the discussion
 * @component
 * @param { DiscussionPageProps } props - The props of the component
 */
function DiscussionPage(props: DiscussionPageProps) {
  const stores: IStoresContext = React.useContext(StoresContext);
  const activeId = computed((): string => stores.activeDiscussion.postId);

  React.useEffect(() => {
    const activeDiscussionStore = stores.activeDiscussion;
    (async () => {
      await activeDiscussionStore.setDiscussion(props.match.params.id);
      const discussionId = activeDiscussionStore.discussion.discussionId;
      stores.reaction.loadThreadReactions(discussionId);
    })();
  }, [
    /* The component should refetch new data every time the id route parameter changes */
    props.match.params.id
  ]);

  return (
    <section id="discussion-page">
      <Observer>{() => <PostMainContainer id={activeId.get()} />}</Observer>
      <div id="main-threads-list-container">
        <Observer>
          {() => (
            <ThreadListContainer
              id={activeId.get()}
              showReplies
              sectionHeader="Replies"
              noPostsMessage={REPLY_PLACEHOLDER_TEXT}
              addPostButtonMessage="Add Reply"
              htmlId="main-replies-list-container"
            />
          )}
        </Observer>
      </div>
    </section>
  );
}

export default withRouter(DiscussionPage);
