import { Reaction } from '../models/store/Reaction';
import { useState, useEffect } from 'react';
import reactionService from '../services/ReactionService';

export function useFetchReactions(postId?: number): [Reaction[], boolean] {
  const [reactions, setReactions] = useState<Reaction[]>();
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchData = async () => {
      const reactions = await reactionService.getReactionsPost(postId);
      setReactions(reactions);
      setLoading(false);
    };
    fetchData();
  }, [postId]);
  return [reactions, loading];
}
