import { Sequelize, Model, DataTypes } from 'sequelize';
import { SequelizeConnectionService } from '../services/sequelize-connection-service';
import { User } from './user';

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

Reaction.init(
  {
    reactionId: { type: DataTypes.INTEGER, autoIncrement: true },
    reactionName: { type: DataTypes.STRING, primaryKey: true },
    postId: { type: DataTypes.INTEGER, primaryKey: true },
    userId: { type: DataTypes.INTEGER }
  },
  {
    sequelize: sequelize,
    modelName: 'reaction',
    tableName: 'reactions',
    freezeTableName: true
  }
);
