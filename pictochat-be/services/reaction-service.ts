import { Reaction } from '../models/reaction';
import { SequelizeConnectionService } from '../services/sequelize-connection-service';
import { UniqueConstraintError } from 'sequelize';
import { UnprocessableError } from '../exceptions/unprocessable-error';
import { DiscussionPost } from '../models/discussion-post';
import { DiscussionPostRepo } from '../repositories/discussion-post-repo';
import { ReactionRepo } from '../repositories/reaction-repo';

const sequelize = SequelizeConnectionService.getInstance();

export class ReactionService {
  static async getReactions(postId: number, userId: number): Promise<Reaction[]> {
    let reaction: Reaction[] = await ReactionRepo.getReactions(postId, userId);
    return reaction;
  }
  static async getReactionsByPost(postId: number): Promise<Reaction[]> {
    let reaction: Reaction[] = await ReactionRepo.getReactionsByPost(postId);
    return reaction;
  }

  static async getReactionsByUser(userId: number): Promise<Reaction[]> {
    let reaction: Reaction[] = await ReactionRepo.getReactionsByUser(userId);
    return reaction;
  }

  static async createReaction(reactionName: string, postId: number, userId: number): Promise<Reaction> {
    return await sequelize.transaction(async transaction => {
      try {
        await DiscussionPostRepo.incrementReactionsCount(postId);
        return await ReactionRepo.createReaction(reactionName, postId, userId);
      } catch (error) {
        if (error instanceof UniqueConstraintError) {
          throw new UnprocessableError('User already has a reaction of the type for this post');
        }
      }
    });
  }

  /**
   * TODO: Use this instead of inlining in router - Jordan
   */
  static async removeReaction(reactionName: string, postId: number, userId: number) {
    const numberRemoved = await ReactionRepo.removeReaction(reactionName, postId, userId);
    await DiscussionPostRepo.decrementReactionsCount(postId);
    return numberRemoved;
  }

  // static async removeReaction(reactionName: string, postId: number, userId: number) {
  //   return await Reaction.removeReaction(reactionName, postId, userId);
  // }
}
