import { Reaction } from "../models/reaction";
import { DiscussionPost } from "../models/discussion-post";
import { DiscussionPostRepo } from "./discussion-post-repo";

export class ReactionRepo {

  static async getReactions(postId: number, userId: number): Promise<Reaction[]> {
    return Reaction.findAll({
      attributes: {
        include: Reaction.PUBLIC_ATTRIBUTES
      },
      where: { postId, userId }
    });
  }

  static async getReactionsByDiscussion(discussionId: number): Promise<Reaction[]> {
    const discussionJoin = {
      model: DiscussionPost,
      as: 'post',
      required: true,
      // attributes: ['postId', 'discussionId'],
      where: { ...DiscussionPostRepo.defaultFilter(), ...{ discussionId } }
    };
    return Reaction.findAll({
      attributes: Reaction.PUBLIC_ATTRIBUTES,
      include: [discussionJoin]
    });
  }

  static async getReactionsByPost(postId: number): Promise<Reaction[]> {
    return Reaction.findAll({
      attributes: {
        include: Reaction.PUBLIC_ATTRIBUTES
      },
      where: { postId }
    });
  }

  static async getReactionsByUser(userId: number): Promise<Reaction[]> {
    return Reaction.findAll({
      attributes: {
        include: Reaction.PUBLIC_ATTRIBUTES
      },
      where: { userId }
    });
  }

  static async createReaction(reactionName: string, postId: number, userId: number): Promise<Reaction> {
    return await Reaction.create({ reactionName, postId, userId });
  }

  static async removeReaction(reactionName: string, postId: number, userId: number) {
    return Reaction.destroy({
      where: {
        reactionName,
        postId,
        userId
      }
    });
  }
}
