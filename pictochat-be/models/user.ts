import { Sequelize, Model, DataTypes } from 'sequelize';
import { SequelizeConnectionService } from '../services/sequelize-connection-service';
import { ImageService } from '../services/image-service';

const sequelize: Sequelize = SequelizeConnectionService.getInstance();

export class User extends Model {
  static readonly PUBLIC_ATTRIBUTES = ['userId', 'email', 'username', 'userAvatarURI'];

  userId!: number;
  username!: string;
  password!: string;
  email: string;
  //temp pre authentication
  resetPasswordToken: string;
  resetPasswordExpiry: Date;

  static async createUser(username: string, hashedPassword: string): Promise<User> {
    return await User.create({ username, password: hashedPassword });
  }

  static async getUserByUsername(username: string): Promise<User> {
    return User.findOne({
      attributes: {
        include: User.PUBLIC_ATTRIBUTES
      },
      where: { username }
    });
  }

  /**
   * @param userId
   * @param onlyIncludePublicAttrs When true, only fields in User.PUBLIC_ATTRIBUTES will be
   *    included in the returned object.
   * @returns a User instance with the specified userId
   */
  static async getUser(userId: number, onlyIncludePublicAttrs: boolean = true): Promise<User> {
    let queryParams = { where: { userId } };
    if (onlyIncludePublicAttrs) {
      queryParams['attributes'] = { include: User.PUBLIC_ATTRIBUTES };
    }
    return await User.findOne(queryParams);
  }

  /**
   * @param onlyIncludePublicAttrs When true, only fields in User.PUBLIC_ATTRIBUTES will be
   *    included in the returned object. */
  static async getUsers(onlyIncludePublicAttrs: boolean = true): Promise<User[]> {
    let queryParams = { order: ['userId'] };
    if (onlyIncludePublicAttrs) {
      queryParams['attributes'] = { include: User.PUBLIC_ATTRIBUTES };
    }
    return User.findAll(queryParams);
  }
}

User.init(
  {
    userId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING },
    username: { type: DataTypes.STRING, unique: true },
    //temp pre authentication
    password: { type: DataTypes.STRING },
    resetPasswordToken: { type: DataTypes.STRING },
    resetPasswordExpiry: { type: DataTypes.DATE },
    // FIXME: All users currently assigned to the same static mock avatar
    userAvatarURI: {
      type: DataTypes.VIRTUAL,
      get() { return ImageService.getUserAvatarURI('4'); }
    }
  },
  {
    sequelize: sequelize,
    modelName: 'user',
    tableName: 'users',
    freezeTableName: true
  }
);
