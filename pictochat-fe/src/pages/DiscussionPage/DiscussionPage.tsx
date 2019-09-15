import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { observer, useAsObservableSource } from 'mobx-react';
import { Loader } from 'semantic-ui-react';
import { parse } from 'query-string';
import { useFetchPost } from '../../hooks/PostsHooks';
import ThreadListContainer from '../../components/ThreadListContainer';
import PostMainContainer from '../../components/PostMainContainer';
import './DiscussionPage.less';
import StoresContext, { IStoresContext } from '../../contexts/StoresContext';

interface Props extends RouteComponentProps<any> { }

@observer
export default class DiscussionPage extends React.Component<Props> {
  static contextType = StoresContext;

  componentDidMount() {
    const id = parse(this.props.location.search).id.toString();
    console.log(`DiscussionPage$useEffect running (id: ${id})`);
    this.context.discussion.setActiveDiscussion(id);
  }

  componentDidUpdate(prevProps: Props) {
    console.log('DiscussionPage$componentDidUpdate');
    console.log(this.props);
  }

  render() {
    // const stores: IStoresContext = React.useContext(StoresContext);
    const id = parse(this.props.location.search).id.toString();
    // const location = useAsObservableSource({ value: props.location });

    // React.useEffect(() => {
    //   console.log(`DiscussionPage$useEffect running (id: ${id})`);
    //   stores.discussion.setActiveDiscussion(id);
    // }, [id]);

    return (
      <section id="discussion-page">
        <PostMainContainer id={id} />
        <ThreadListContainer
          id={id}
          showReplies
          sectionHeader="Replies"
          noPostsMessage="No replies have been added yet! Be the first to add a reply!"
          addPostButtonMessage="Add Reply"
        />
      </section>
    );
  }
}

// function DiscussionPage(props: Props) {
//   const stores: IStoresContext = React.useContext(StoresContext);
//   const id = parse(props.location.search).id.toString();
//   // const location = useAsObservableSource({ value: props.location });

//   React.useEffect(() => {
//     console.log(`DiscussionPage$useEffect running (id: ${id})`);
//     stores.discussion.setActiveDiscussion(id);
//   }, [id]);

//   return (
//     <section id="discussion-page">
//       <PostMainContainer id={id} />
//       <ThreadListContainer
//         id={id}
//         showReplies
//         sectionHeader="Replies"
//         noPostsMessage="No replies have been added yet! Be the first to add a reply!"
//         addPostButtonMessage="Add Reply"
//       />
//     </section>
//   );
// }

// export default observer(DiscussionPage);
