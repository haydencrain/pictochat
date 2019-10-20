import { Reaction } from '../models/reaction';
import { UniqueConstraintError } from 'sequelize';
import { UnprocessableError } from '../exceptions/unprocessable-error';
import { DiscussionPostRepo } from '../repositories/discussion-post-repo';
import { ReactionRepo } from '../repositories/reaction-repo';
import { transaction } from '../utils/transaction';
import { UserRepo } from '../repositories/user-repo';
import { NotFoundError } from '../exceptions/not-found-error';
import { ForbiddenError } from '../exceptions/forbidden-error';

/** Implements reaction related CRUD */
export class ReactionService {
  /**
   * Returns all reactions made by a user for a post
   * @param postId
   * @param userId
   */
  static async getReactions(postId: number, userId: number): Promise<Reaction[]> {
    let reaction: Reaction[] = await ReactionRepo.getReactions(postId, userId);
    return reaction;
  }

  /**
   * Returns all reactions made for a post
   * @param postId
   */
  static async getReactionsByPost(postId: number): Promise<Reaction[]> {
    let reaction: Reaction[] = await ReactionRepo.getReactionsByPost(postId);
    return reaction;
  }

  /**
   * Returns all reactions made by a user
   * @param userId
   */
  static async getReactionsByUser(userId: number): Promise<Reaction[]> {
    let reaction: Reaction[] = await ReactionRepo.getReactionsByUser(userId);
    return reaction;
  }

  /**
   * Creates a specific reaction for a post by a user
   * @param reactionName
   * @param postId
   * @param userId
   */
  static async createReaction(reactionName: string, postId: number, userId: number): Promise<Reaction> {
    return await transaction(async () => {
      try {
        const reaction: Reaction = await ReactionRepo.createReaction(reactionName, postId, userId);
        await DiscussionPostRepo.incrementReactionsCount(postId);
        return reaction;
      } catch (error) {
        if (error instanceof UniqueConstraintError) {
          // Occurs if user already has a reaction for this post
          throw new UnprocessableError('User already has a reaction for this post');
        }
      }
    });
  }

  /**
   * Deletes a reaction
   * @param reactionId
   * @param requestingUserId User trying to delete the reaction
   */
  static async removeReaction(reactionId: number, requestingUserId: number): Promise<void> {
    await transaction(async () => {
      const requestingUser = await UserRepo.getUser(requestingUserId);

      const reaction = await ReactionRepo.getReaction({ reactionId });
      if (reaction === null) throw new NotFoundError();

      // Users can only remove their own reactions
      if (requestingUser.userId !== reaction.userId) throw new ForbiddenError();

      await reaction.destroy();
      await DiscussionPostRepo.decrementReactionsCount(reaction.postId);
    });
  }
}
