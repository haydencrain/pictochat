import { Reaction } from '../models/reaction';
import { DiscussionPost } from '../models/discussion-post';

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

  static async createReaction(reactionName: string, postId: number, userId: number): Promise<Reaction> {
    const reaction = await Reaction.createReaction(reactionName, postId, userId);
    await DiscussionPost.incrementReactionsCount(postId);
    return reaction;
  }

  static async removeReaction(reactionName: string, postId: number, userId: number) {
    const numberRemoved = await Reaction.removeReaction(reactionName, postId, userId);
    await DiscussionPost.decrementReactionsCount(postId);
    return numberRemoved;
  }
}
