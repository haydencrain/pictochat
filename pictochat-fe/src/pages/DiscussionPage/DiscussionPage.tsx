import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Observer } from 'mobx-react';
import StoresContext, { IStoresContext } from '../../contexts/StoresContext';
import ThreadListContainer from '../../components/Post/ThreadListContainer';
import { computed } from 'mobx';
import PostMainContainer from '../../components/Post/PostMainContainer';
import './DiscussionPage.less';

interface DiscussionPageMatchParams {
  id: string;
}

interface DiscussionPageProps extends RouteComponentProps<DiscussionPageMatchParams> {}

function DiscussionPage(props: DiscussionPageProps) {
  const stores: IStoresContext = React.useContext(StoresContext);
  const activeId = computed((): string => stores.activeDiscussion.activeDiscussionRootId);

  React.useEffect(() => {
    const activeDiscussionStore = stores.activeDiscussion;
    (async () => {
      await activeDiscussionStore.setActiveDiscussion(props.match.params.id);
      const discussionId = activeDiscussionStore.activeDiscussionRoot.discussionId;
      stores.reaction.loadThreadReactions(discussionId);
    })();
  }, [props.match.params.id]);

  return (
    <section id="discussion-page">
      <Observer>{() => <PostMainContainer id={activeId.get()} />}</Observer>
      <Observer>
        {() => (
          <ThreadListContainer
            id={activeId.get()}
            showReplies
            sectionHeader="Replies"
            noPostsMessage="No replies have been added yet! Be the first to add a reply!"
            addPostButtonMessage="Add Reply"
          />
        )}
      </Observer>
    </section>
  );
}

export default withRouter(DiscussionPage);
