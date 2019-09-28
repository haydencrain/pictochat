import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Location } from 'history';
import { observer, useAsObservableSource, Observer } from 'mobx-react';
import { Loader } from 'semantic-ui-react';
import { parse } from 'query-string';
import { useFetchPost } from '../../hooks/PostsHooks';
import ThreadListContainer from '../../components/ThreadListContainer';
import PostMainContainer from '../../components/PostMainContainer';
import './DiscussionPage.less';
import StoresContext, { IStoresContext } from '../../contexts/StoresContext';
import { computed, observable } from 'mobx';

interface Props extends RouteComponentProps<any> {}

/**
 * Extracts from query parameter with the specified name from the specified
 * browser location
 */
function extractParameter(parameter: string, location: Location): string {
  return parse(location.search)[parameter].toString();
}

/**
 * NOTE: This function is written to use JSX Observer components
 * rather than being wrapped in observer(...) because the useAsObservableSource
 * call will cause double renders if the later approach is used.
 */
export default function DiscussionPage(props: Props) {
  const stores: IStoresContext = React.useContext(StoresContext);
  const queryParams = useAsObservableSource({ id: parse(props.location.search).id.toString() });

  React.useEffect(() => {
    stores.discussion.setActiveDiscussion(queryParams.id);
  }, [props.location]);

  return (
    <section id="discussion-page">
      <Observer>{() => <PostMainContainer id={queryParams.id} />}</Observer>
      <Observer>
        {() => (
          <ThreadListContainer
            id={queryParams.id}
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
