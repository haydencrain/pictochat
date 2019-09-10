import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Loader } from 'semantic-ui-react';
import { parse } from 'query-string';
import { useFetchPost } from '../../hooks/PostsHooks';
import ThreadListContainer from '../../components/ThreadListContainer';
import PostMainContainer from '../../components/PostMainContainer';
import './DiscussionPage.less';

interface Props extends RouteComponentProps<any> {}

export default function DiscussionPage(props: Props) {
  const id = parse(props.location.search).id.toString();
  const [post, isLoading] = useFetchPost(id);

  if (isLoading) return <Loader active inline />;
  return (
    <section id="discussion-page">
      <PostMainContainer id={id} />
      <ThreadListContainer
        id={id}
        showReplies
        sectionHeader={`Replies (${post.commentCount})`}
        noPostsMessage="No replies have been added yet! Be the first to add a reply!"
        addPostButtonMessage="Add Reply"
      />
    </section>
  );
}
