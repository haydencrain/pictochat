import { Reaction } from '../models/reaction';
import { UniqueConstraintError } from 'sequelize';
import { UnprocessableError } from '../exceptions/unprocessable-error';
import { DiscussionPostRepo } from '../repositories/discussion-post-repo';
import { ReactionRepo } from '../repositories/reaction-repo';
import { transaction } from '../utils/transaction';
import { UserRepo } from '../repositories/user-repo';
import { NotFoundError } from '../exceptions/not-found-error';
import { ForbiddenError } from '../exceptions/forbidden-error';

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
    return await transaction(async () => {
      try {
        const reaction: Reaction = await ReactionRepo.createReaction(reactionName, postId, userId);
        await DiscussionPostRepo.incrementReactionsCount(postId);
        return reaction;
      } catch (error) {
        if (error instanceof UniqueConstraintError) {
          throw new UnprocessableError('User already has a reaction for this post');
        }
      }
    });
  }

  static async removeReaction(reactionId: number, requestingUserId: number): Promise<void> {
    await transaction(async () => {
      const requestingUser = await UserRepo.getUser(requestingUserId);

      const reaction = await ReactionRepo.getReaction({ reactionId });
      if (reaction === null) throw new NotFoundError();

      if (requestingUser.userId !== reaction.userId) throw new ForbiddenError();

      await reaction.destroy();
      await DiscussionPostRepo.decrementReactionsCount(reaction.postId);
    });
  }
}
