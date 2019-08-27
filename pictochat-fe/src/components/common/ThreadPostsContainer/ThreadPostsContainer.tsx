import * as React from 'react';
import discussionService from '../../../services/DiscussionService';
import ThreadPostsList from '../ThreadPostsList';
import { DiscussionPost } from '../../../model/DiscussionPost';

export default function ThreadPostsContainer(props: {}) {
  const [posts, isLoading] = useFetchPosts();
  if (isLoading) return null;
  return (
    <>
      <h1>Threads</h1>
      <ThreadPostsList posts={posts} />
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
