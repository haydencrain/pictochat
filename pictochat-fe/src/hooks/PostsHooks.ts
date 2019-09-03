import { DiscussionPost } from '../models/DiscussionPost';
import { useState, useEffect } from 'react';
import discussionService from '../services/DiscussionService';

export function useFetchPosts(): [DiscussionPost[], boolean] {
  const [posts, setPosts] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      const posts = await discussionService.getRootDiscussionPosts();
      setPosts(posts);
      setLoading(false);
    };
    fetchData();
  }, []);

  return [posts, loading];
}

export function useFetchPost(id: string): [DiscussionPost, boolean] {
  const [post, setPost] = useState();
  const [loading, setLoading] = useState(true);

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
