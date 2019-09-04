import { DiscussionPost } from '../models/DiscussionPost';
import { useState, useEffect } from 'react';
import discussionService from '../services/DiscussionService';

export function useFetchPosts(): [DiscussionPost[], boolean] {
  const [posts, setPosts] = useState<DiscussionPost[]>();
  const [loading, setLoading] = useState<boolean>(true);
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

export function useFetchPostReplies(id: string): [DiscussionPost[], boolean] {
  const [replies, setReplies] = useState<DiscussionPost[]>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const replies = await discussionService.getDiscussionReplies(id);
      setReplies(replies);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  return [replies, loading];
}
