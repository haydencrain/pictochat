import * as React from 'react';
import discussionService from '../../services/DiscussionService';
import { DiscussionPost } from '../../models/DiscussionPost';
import { Segment, Loader } from 'semantic-ui-react';
import Thread from '../Post';
import ThreadPostsList from '../PostsList';
import ThreadReplies from '../PostReplies';
import PostsList from '../PostsList';

export default function DiscussionContainer(props: { id: string }) {
  const [post, isLoading] = useFetchPost(props.id);
  if (isLoading) return <Loader active inline />;
  return (
    <>
      <h1>Thread by {post.author.userName}</h1>
      <Segment raised>
        <Thread post={post} />
      </Segment>
      <h1>Replies ({post.commentCount})</h1>
      <PostsList posts={post.replies} raised showReplies />
    </>
  );
}

function useFetchPost(id: string): [DiscussionPost, boolean] {
  const [post, setPost] = React.useState();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      const post = await discussionService.getDiscussion(id);
      setPost(post);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  return [post, loading];
}
