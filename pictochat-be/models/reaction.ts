import { Sequelize, Model, DataTypes } from 'sequelize';
import { SequelizeConnectionService } from '../services/sequelize-connection-service';
import { User } from './user';
import { DiscussionPost } from './discussion-post';

const sequelize: Sequelize = SequelizeConnectionService.getInstance();

export class Reaction extends Model {
  static readonly PUBLIC_ATTRIBUTES = ['reactionId', 'reactionName', 'postId', 'userId'];

  reactionId!: number;
  reactionName!: string;
  postId!: number;
  userId!: number;

  getPublicJSON(): any {
    let json = {};

    for (let attr of Reaction.PUBLIC_ATTRIBUTES) {
      json[attr] = this.getDataValue(attr as any);
    }
    return json;
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
   * GET reactions based on `discussionId`
   * @param discussionId
   */
  static async getReactionsByDiscussion(discussionId: number): Promise<Reaction[]> {
    const discussionJoin = {
      model: DiscussionPost,
      as: 'post',
      required: true,
      // attributes: ['postId', 'discussionId'],
      where: { ...DiscussionPost.defaultFilter(), ...{ discussionId } }
    };
    return Reaction.findAll({
      attributes: Reaction.PUBLIC_ATTRIBUTES,
      include: [discussionJoin]
    });
  }
  /**
   * GET reactions based on `postId`
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
   * GET reactions based on `userId`
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
   * CREATE reaction
   * @param reactionName
   * @param postId
   * @param userId
   */
  static async createReaction(reactionName: string, postId: number, userId: number): Promise<Reaction> {
    return await Reaction.create({ reactionName, postId, userId });
  }

  // static async removeReaction(reactionName: string, postId: number, userId: number) {
  //   return Reaction.destroy({
  //     where: {
  //       reactionName,
  //       postId,
  //       userId
  //     }
  //   });
  // }
}

Reaction.init(
  {
    reactionId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    reactionName: { type: DataTypes.STRING },
    postId: { type: DataTypes.INTEGER },
    userId: { type: DataTypes.INTEGER }
  },
  {
    sequelize: sequelize,
    modelName: 'reaction',
    tableName: 'reactions',
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ['postId', 'userId']
      }
    ]
  }
);

Reaction.belongsTo(DiscussionPost, { as: 'post', targetKey: 'postId', foreignKey: 'postId', constraints: true });
Reaction.belongsTo(User, { as: 'user', targetKey: 'userId', foreignKey: 'userId', constraints: true });
