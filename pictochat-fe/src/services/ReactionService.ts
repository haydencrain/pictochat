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

  static async addReaction(
    reactionId: number,
    reactionName: string,
    postId: number,
    userId: number
  ): Promise<IReaction> {
    const data = {
      reactionId: reactionId,
      reactionName: reactionName,
      postId: postId,
      userId: userId
    };
    let res = await ApiService.post('/reaction', data);
    return res.reaction;
  }

  static async removeReaction(reactionId: number) {
    return await ApiService.sendDelete(`/reaction?reactionId=${reactionId}`);
  }
}

export default ReactionService;
