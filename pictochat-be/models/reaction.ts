import { Sequelize, Model, DataTypes } from 'sequelize';
import { SequelizeConnectionService } from '../services/sequelize-connection-service';
import { User } from './user';

const sequelize: Sequelize = SequelizeConnectionService.getInstance();

export class Reaction extends Model {
  static readonly PUBLIC_ATTRIBUTES = ['postId', 'userId', 'reactionId'];

  postId!: number;
  userId!: number;
  reactionId!: number;

  getPublicJSON(): any {
    let json = {};

    for (let attr of Reaction.PUBLIC_ATTRIBUTES) {
      json[attr] = this.getDataValue(attr as any);
    }
    return json;
  }

  static async getReactions(postId: number, userId: number): Promise<Reaction[]> {
    return Reaction.findAll({
      attributes: {
        include: Reaction.PUBLIC_ATTRIBUTES
      },
      where: { postId, userId }
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

  static async createReaction(postId: number, userId: number, reactionId: number): Promise<Reaction> {
    return await Reaction.create({ postId, userId, reactionId });
  }

  static async removeReaction(postId: number, userId: number, reactionId: number) {
    return Reaction.destroy({
      where: {
        postId,
        userId,
        reactionId
      }
    });
  }
}

Reaction.init(
  {
    postId: { type: DataTypes.INTEGER },
    userId: { type: DataTypes.INTEGER },
    reactionId: { type: DataTypes.INTEGER }
  },
  {
    sequelize: sequelize,
    modelName: 'reaction',
    tableName: 'reactions',
    freezeTableName: true
  }
);
