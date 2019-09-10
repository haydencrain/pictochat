import { DiscussionPost } from '../models/DiscussionPost';
import { useState, useEffect } from 'react';
import discussionService from '../services/DiscussionService';

export function useFetchPosts(id?: string): [DiscussionPost[], boolean] {
  const [posts, setPosts] = useState<DiscussionPost[]>();
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchData = async () => {
      const postsPromise = !id
        ? discussionService.getRootDiscussionPosts()
        : discussionService.getDiscussionReplies(id);
      const posts = await postsPromise;
      setPosts(posts);
      setLoading(false);
    };
    fetchData();
  }, []);

  return [posts, loading];
}

export function useFetchPost(id: string): [DiscussionPost, boolean] {
  const [post, setPost] = useState<DiscussionPost>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const post = await discussionService.getDiscussion(id);
      setPost(post);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  return [post, loading];
}
