import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Segment, Loader } from 'semantic-ui-react';
import { parse } from 'query-string';
import { useFetchPost } from '../../hooks/PostsHooks';
import PostsList from '../../components/PostsList';
import Post from '../../components/Post';
import './DiscussionPage.less';

interface Props extends RouteComponentProps<any> {}

export default function DiscussionPage(props: Props) {
  const id = parse(props.location.search).id.toString();
  const [post, isLoading] = useFetchPost(id);

  if (isLoading) return <Loader active inline />;
  return (
    <section id="discussion-page">
      <h1>Thread by {post.author.userName}</h1>
      <Segment raised>
        <Post post={post} />
      </Segment>
      <h1>Replies ({post.commentCount})</h1>
      <PostsList
        posts={post.replies}
        noPostsMessage="No replies have been added yet! Be the first to add a reply!"
        raised
        showReplies
      />
    </section>
  );
}
