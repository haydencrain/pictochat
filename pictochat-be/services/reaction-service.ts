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

  static async createReaction(
    reactionId: number,
    reactionName: string,
    postId: number,
    userId: number
  ): Promise<Reaction> {
    return await Reaction.createReaction(reactionId, reactionName, postId, userId);
  }

  static async removeReaction(reactionId: number) {
    return await Reaction.removeReaction(reactionId);
  }
}
