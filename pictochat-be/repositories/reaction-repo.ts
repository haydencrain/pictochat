import { Reaction } from "../models/reaction";
import { DiscussionPost } from "../models/discussion-post";
import { DiscussionPostRepo } from "./discussion-post-repo";

export class ReactionRepo {

  /**
   * @param params Identifying info for the reactions.
   *    Must be object of type { reactionId: number } or { userId: number, postId: number }
   */
  static async getReaction(
    params: { reactionId?: number, userId?: number, postId?: number }
  ): Promise<Reaction> {
    console.log('getReaction$params: ', params);
    if (params.reactionId !== undefined) {
      return await Reaction.findOne({ where: { reactionId: params.reactionId } });
    } else if (params.userId !== undefined && params.postId !== undefined) {
      return await Reaction.findOne({ where: { userId: params.userId, postId: params.postId } });
    }
    throw new Error('Either params.reactionId or both params.userId and params.postId must be specified');
  }

  /**
   * GET reactions based on `postId` and `userId`
   * @param postId
   * @param userId
   */
  static async getReactions(postId: number, userId: number): Promise<Reaction[]> {
    return Reaction.findAll({
      attributes: {
        include: Reaction.PUBLIC_ATTRIBUTES
      },
      where: { postId, userId }
    });
  }

  /**
   * Get reactions based on `discussionId`
   * @param discussionId
   */
  static async getReactionsByDiscussion(discussionId: number): Promise<Reaction[]> {
    const discussionJoin = {
      model: DiscussionPost,
      as: 'post',
      required: true,
      where: { ...DiscussionPostRepo.defaultFilter(), ...{ discussionId } }
    };
    return Reaction.findAll({
      attributes: Reaction.PUBLIC_ATTRIBUTES,
      include: [discussionJoin]
    });
  }

  /**
   * Get reactions based on `postId`
   * @param postId
   */
  static async getReactionsByPost(postId: number): Promise<Reaction[]> {
    return Reaction.findAll({
      attributes: {
        include: Reaction.PUBLIC_ATTRIBUTES
      },
      where: { postId }
    });
  }

  /**
   * Get reactions based on `userId`
   * @param userId
   */
  static async getReactionsByUser(userId: number): Promise<Reaction[]> {
    return Reaction.findAll({
      attributes: {
        include: Reaction.PUBLIC_ATTRIBUTES
      },
      where: { userId }
    });
  }

  /**
   * @param reactionName Name of the reactions type
   * @param postId Post being reacted too
   * @param userId User who made the reaction
   */
  static async createReaction(reactionName: string, postId: number, userId: number): Promise<Reaction> {
    return await Reaction.create({ reactionName, postId, userId });
  }
}
