import ApiService from './ApiService';
import { Reaction, IReaction } from '../models/store/Reaction';
import { reaction } from 'mobx';

class ReactionService {
  static async getDiscussionReactions(discussionId: string): Promise<IReaction[]> {
    return await ApiService.get('/reaction', { discussionId, by: 'DISCUSSION' });
  }

  static async getReactions(postId: number, userId: number): Promise<Reaction[]> {
    return await ApiService.get(`/reaction/${postId}${userId}`);
  }

  static async getReactionsPost(postId: number): Promise<Reaction[]> {
    try {
      return await ApiService.get(`/reaction`, { postId, by: 'POST' });
    } catch (error) {
      if (!!error.status && error.status === 404) return [];
      throw error;
    }
  }

  static async getReactionsUser(userId: number): Promise<Reaction[]> {
    return await ApiService.get(`/reaction`, { userId, by: 'USER' });
  }

  static async addReaction(reactionName: string, postId: number, userId: number): Promise<Reaction> {
    let data = {
      reactionName: reactionName,
      postId: postId,
      userId: userId
    };
    return await ApiService.post('/reaction', data);
    // let res = await ApiService.post('/reaction', data);
    // return res.reaction;
  }

  static async removeReaction(reactionId: number): Promise<void> {
    return await ApiService.sendDelete(`/reaction/${reactionId}`);
  }

  // static async removeReaction(reactionName: string, postId: number, userId: number) {
  //   let data = {
  //     reactionName: reactionName,
  //     postId: postId,
  //     userId: userId
  //   };
  //   return await ApiService.sendDelete(`/reaction`, data);
  // }
}

export default ReactionService;
