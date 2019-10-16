import { Sequelize, Model, DataTypes } from 'sequelize';
import { SequelizeConnection } from '../utils/sequelize-connection';
import { User } from './user';
import { DiscussionPost } from './discussion-post';

const sequelize: Sequelize = SequelizeConnection.getInstance();

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
    indexes: [{
      unique: true,
      fields: ['postId', 'userId']
    }]
  }
);

Reaction.belongsTo(DiscussionPost, { as: 'post', targetKey: 'postId', foreignKey: 'postId', constraints: true });
Reaction.belongsTo(User, { as: 'user', targetKey: 'userId', foreignKey: 'userId', constraints: true });
