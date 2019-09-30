import { Reaction } from '../models/reaction';

export class ReactionService {
  static async getReactions(postId: number, userId: number): Promise<Reaction[]> {
    let reaction: Reaction[] = await Reaction.getReactions(postId, userId);
    return reaction;
  }
  static async getReactionsByPost(postId: number): Promise<Reaction[]> {
    let reaction: Reaction[] = await Reaction.getReactionsByPost(postId);
    return reaction;
  }

  static async getReactionsByUser(userId: number): Promise<Reaction[]> {
    let reaction: Reaction[] = await Reaction.getReactionsByUser(userId);
    return reaction;
  }

  static async createReaction(postId: number, userId: number, reactionId: number): Promise<Reaction> {
    return await Reaction.createReaction(postId, userId, reactionId);
  }

  static async removeReaction(postId: number, userId: number, reactionId: number) {
    return await Reaction.removeReaction(postId, userId, reactionId);
  }
}
