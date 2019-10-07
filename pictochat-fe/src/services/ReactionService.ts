import ApiService from './ApiService';
import { Reaction } from '../models/Reaction';
import { reaction } from 'mobx';

class ReactionService {
  static async getReactions(postId: number, userId: number): Promise<Reaction[]> {
    return await ApiService.get(`/reaction/${postId}${userId}`);
  }

  static async getReactionsPost(postId: number): Promise<Reaction[]> {
    try {
      return await ApiService.get(`/reaction?postId=${postId}`);
    } catch (error) {
      if (!!error.status && error.status === 404) return [];
      throw error;
    }
  }

  static async getReactionsUser(userId: number): Promise<Reaction[]> {
    return await ApiService.get(`/reaction/${userId}`);
  }

  static async addReaction(reactionName: string, postId: number, userId: number): Promise<Reaction> {
    let data = {
      reactionName: reactionName,
      postId: postId,
      userId: userId
    };
    let res = await ApiService.post('/reaction', data);
    return res.reaction;
  }

  static async removeReaction(reactionName: string, postId: number, userId: number) {
    let data = {
      reactionName: reactionName,
      postId: postId,
      userId: userId
    };
    return await ApiService.sendDelete(`/reaction`, data);
  }
}

export default ReactionService;
