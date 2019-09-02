import * as React from 'react';
import discussionService from '../../services/DiscussionService';
import PostsList from '../PostsList';
import { DiscussionPost } from '../../models/DiscussionPost';
import { Loader } from 'semantic-ui-react';

export default function ThreadPostsContainer(props: {}) {
  const [posts, isLoading] = useFetchPosts();
  if (isLoading) return <Loader active inline />;
  return (
    <>
      <h1>Threads</h1>
      <PostsList posts={posts} showReplies={false} raised />
    </>
  );
}

function useFetchPosts(): [DiscussionPost[], boolean] {
  const [posts, setPosts] = React.useState();
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const fetchData = async () => {
      const posts = await discussionService.getRootDiscussionPosts();
      setPosts(posts);
      setLoading(false);
    };
    fetchData();
  }, []);

  return [posts, loading];
}
