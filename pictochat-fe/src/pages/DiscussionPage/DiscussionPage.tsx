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

interface Props extends RouteComponentProps<any> { }

// @observer
// export default class DiscussionPage extends React.Component<Props> {
//   static contextType = StoresContext;

//   componentDidMount() {
//     console.log('COMPONENT DID MOUNT DiscussionPage');
//     const id = parse(this.props.location.search).id.toString();
//     console.log(`DiscussionPage$useEffect running (id: ${id})`);
//     this.context.discussion.setActiveDiscussion(id);
//   }

//   componentDidUpdate(prevProps: Props) {
//     console.log('COMPONENT DID UPDATE DiscussionPage');
//     console.log('DiscussionPage$componentDidUpdate');
//     console.log(this.props);
//   }

//   render() {
//     // const stores: IStoresContext = React.useContext(StoresContext);
//     const id = parse(this.props.location.search).id.toString();
//     console.log('RENDER DiscussionPage');
//     // const location = useAsObservableSource({ value: props.location });

//     // React.useEffect(() => {
//     //   console.log(`DiscussionPage$useEffect running (id: ${id})`);
//     //   stores.discussion.setActiveDiscussion(id);
//     // }, [id]);

//     return (
//       <section id="discussion-page">
//         <PostMainContainer id={id} />
//         <ThreadListContainer
//           id={id}
//           showReplies
//           sectionHeader="Replies"
//           noPostsMessage="No replies have been added yet! Be the first to add a reply!"
//           addPostButtonMessage="Add Reply"
//         />
//       </section>
//     );
//   }
// }


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
  console.log('[DiscussionPage] RENDER', props.location.search);
  const stores: IStoresContext = React.useContext(StoresContext);
  const observableProps = useAsObservableSource(props);
  // const id = extractParameter('id', observableProps.location);
  const queryParams = useAsObservableSource({ id: parse(props.location.search).id.toString() });
  // const id = parse(props.location.search).id.toString();
  // const location = useAsObservableSource({ value: props.location });

  React.useEffect(() => {
    // console.log(`[DiscussionPage] USE EFFECT running (id: ${extractParameter('id', props.location)})`);
    stores.discussion.setActiveDiscussion(queryParams.id);
    // stores.discussion.setActiveDiscussion(extractParameter('id', observableProps.location));
  });

  // Need this to run everytime the component is rendered! - hence the lack of an useEffect call
  // stores.discussion.setActiveDiscussion(id);

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
