import ApiService from './ApiService';
import { Reaction } from '../models/Reaction';
import { reaction } from 'mobx';

class ReactionService {
  static async getReactions(postId: number, userId: number): Promise<Reaction[]> {
    const query = {
      postId,
      userId
    };
    return await ApiService.get('/reaction', query);
  }

  static async getReactionsPost(postId: number): Promise<Reaction[]> {
    const query = {
      postId
    };
    return await ApiService.get('/reaction', query);
  }

  static async getReactionsUser(userId: number): Promise<Reaction[]> {
    const query = {
      userId
    };
    return await ApiService.get('/reaction', query);
  }

  static async addReaction(
    reactionId: number,
    reactionName: string,
    postId: number,
    userId: number
  ): Promise<Reaction> {
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
