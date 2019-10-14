import { Reaction } from '../models/reaction';
import { SequelizeConnectionService } from '../services/sequelize-connection-service';
import { UniqueConstraintError } from 'sequelize';
import { UnprocessableError } from '../exceptions/unprocessable-error';
import { DiscussionPost } from '../models/discussion-post';

const sequelize = SequelizeConnectionService.getInstance();

/** Implements reaction related CRUD */
export class ReactionService {
  /**
   * Returns all reactions made by a user for a post
   * @param postId
   * @param userId
   */
  static async getReactions(postId: number, userId: number): Promise<Reaction[]> {
    let reaction: Reaction[] = await Reaction.getReactions(postId, userId);
    return reaction;
  }
  /**
   * Returns all reactions made for a post
   * @param postId
   */
  static async getReactionsByPost(postId: number): Promise<Reaction[]> {
    let reaction: Reaction[] = await Reaction.getReactionsByPost(postId);
    return reaction;
  }
  /**
   * Returns all reactions made by a user
   * @param userId
   */
  static async getReactionsByUser(userId: number): Promise<Reaction[]> {
    let reaction: Reaction[] = await Reaction.getReactionsByUser(userId);
    return reaction;
  }
  /**
   * Creates a specific reaction for a post by a user
   * @param reactionName
   * @param postId
   * @param userId
   */
  static async createReaction(reactionName: string, postId: number, userId: number): Promise<Reaction> {
    return await sequelize.transaction(async transaction => {
      try {
        /** Increments the number of reactions made on that post */
        await DiscussionPost.incrementReactionsCount(postId);
        return await Reaction.createReaction(reactionName, postId, userId);
        /** Checks that the user's reaction is unique for said post  */
      } catch (error) {
        if (error instanceof UniqueConstraintError) {
          throw new UnprocessableError('User already has a reaction of the type for this post');
        }
      }
    });
  }

  //Don't know what to do here -Rach

  /**
   * TODO: Use this instead of inlining in router - Jordan
   */
  static async removeReaction(reactionName: string, postId: number, userId: number) {
    // const numberRemoved = await Reaction.removeReaction(reactionName, postId, userId);
    // await DiscussionPost.decrementReactionsCount(postId);
    // return numberRemoved;
  }

  // static async removeReaction(reactionName: string, postId: number, userId: number) {
  //   return await Reaction.removeReaction(reactionName, postId, userId);
  // }
}
