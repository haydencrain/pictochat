import * as React from 'react';
import discussionService from '../../../services/DiscussionService';
import ThreadPostsList from '../ThreadPostsList';

export default function ThreadPostsContainer(props: {}) {
  const [posts, isLoading] = useFetchPosts();
  return !isLoading && <ThreadPostsList posts={posts} />;
}

function useFetchPosts() {
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
