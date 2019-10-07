import { Reaction } from '../models/reaction';
import { SequelizeConnectionService } from '../services/sequelize-connection-service';
import { UniqueConstraintError } from 'sequelize';
import { UnprocessableError } from '../exceptions/unprocessable-error';

const sequelize = SequelizeConnectionService.getInstance();

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
    return await sequelize.transaction(async transaction => {
      try {
        return await Reaction.createReaction(reactionName, postId, userId);
      } catch (error) {
        if (error instanceof UniqueConstraintError) {
          throw new UnprocessableError('User already has a reaction of the type for this post');
        }
      }
    });

  }

  // static async removeReaction(reactionName: string, postId: number, userId: number) {
  //   return await Reaction.removeReaction(reactionName, postId, userId);
  // }
}
