import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Observer } from 'mobx-react';
import StoresContext, { IStoresContext } from '../../contexts/StoresContext';
import NavHistoryContext from '../../contexts/NavHistoryContext';
import ThreadListContainer from '../../components/ThreadListContainer';
import { computed } from 'mobx';
import PostMainContainer from '../../components/PostMainContainer';
import './DiscussionPage.less';

interface DiscussionPageMatchParams {
  id: string;
}

interface DiscussionPageProps extends RouteComponentProps<DiscussionPageMatchParams> {}

function DiscussionPage(props: DiscussionPageProps) {
  const stores: IStoresContext = React.useContext(StoresContext);
  const activeId = computed((): string => stores.discussion.activeDiscussionRootId);

  React.useEffect(() => {
    stores.discussion.setActiveDiscussion(props.match.params.id);
  }, [props.match.params.id]);

  return (
    <NavHistoryContext.Provider value={props.history}>
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
    </NavHistoryContext.Provider>
  );
}

export default withRouter(DiscussionPage);
