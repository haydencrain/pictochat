import { DiscussionPost } from '../models/DiscussionPost';
import { useState, useEffect } from 'react';
import discussionService from '../services/DiscussionService';

export function useFetchPosts(id?: string): [DiscussionPost[], boolean] {
  const [posts, setPosts] = useState<DiscussionPost[]>();
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchData = async () => {
      const postsPromise = !id ? discussionService.getDiscussions() : discussionService.getPostReplies(id);
      const posts = await postsPromise;
      setPosts(posts);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  return [posts, loading];
}

export function useFetchPost(id: string): [DiscussionPost, boolean] {
  const [post, setPost] = useState<DiscussionPost>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const post = await discussionService.getPost(id);
      setPost(post);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  return [post, loading];
}
