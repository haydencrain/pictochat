import * as React from 'react';
import discussionService from '../../../services/DiscussionService';
import { DiscussionPost } from '../../../model/DiscussionPost';
import { Segment } from 'semantic-ui-react';
import ThreadPost from '../ThreadPost';
import ThreadPostsList from '../ThreadPostsList';

export default function DiscussionContainer(props: { id: string }) {
  const [post, isLoading] = useFetchPost(props.id);
  if (isLoading) return null;
  return (
    <>
      <h1>Thread by {post.author.userName}</h1>
      <Segment raised>
        <ThreadPost post={post} />
      </Segment>
      <h1>Replies ({post.commentCount})</h1>
      <ThreadPostsList posts={post.replies} showReplies={true} />
    </>
  );
}

function useFetchPost(id: string): [DiscussionPost, boolean] {
  const [post, setPost] = React.useState();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      const post = await discussionService.getDiscussion(id);
      console.log(post);
      setPost(post);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  return [post, loading];
}
