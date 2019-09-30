import ApiService from './ApiService';
import { IReaction } from '../models/Reaction';
import { reaction } from 'mobx';

class ReactionService {
  static async getReactions(postId: number, userId: number): Promise<IReaction[]> {
    return await ApiService.get(`/reaction?postId=${postId}?userId=${userId}`);
  }

  static async getReactionsPost(postId: number): Promise<IReaction[]> {
    return await ApiService.get(`/reaction?postId=${postId}`);
  }

  static async getReactionsUser(userId: number): Promise<IReaction[]> {
    return await ApiService.get(`/reaction?userId=${userId}`);
  }

  static async addReaction(postId: number, userId: number, reactionId: number): Promise<IReaction> {
    const data = {
      postId: postId,
      userId: userId,
      reactionId: reactionId
    };
    let res = await ApiService.post('/reaction', data);
    return res.reaction;
  }
}
