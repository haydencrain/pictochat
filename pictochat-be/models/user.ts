import { Sequelize, Model, DataTypes, WhereOptions } from 'sequelize';
import { SequelizeConnectionService } from '../services/sequelize-connection-service';
import { ImageService } from '../services/image-service';

const sequelize: Sequelize = SequelizeConnectionService.getInstance();

export class User extends Model {
  static readonly PUBLIC_ATTRIBUTES = ['userId', 'email', 'username', 'userAvatarURI'];
  static readonly PUBLIC_TABLE_COLUMNS = ['userId', 'email', 'username']; // Everything from PUBLIC_ATTRIBUTES excluding virtual columns

  userId!: number;
  username!: string;
  password!: string;
  email: string;
  hasAdminRole: boolean;
  //temp pre authentication
  resetPasswordToken: string;
  resetPasswordExpiry: Date;

  /**
   * @returns JSON with only PUBLIC_ATTRIBUTES */
  getPublicJSON(): any {
    let json = {};
    // FIXME: Use PUBLIC_ATTRIBUTES - Jordan
    for (let attr of ['userId', 'email', 'username']) {
      json[attr] = this.getDataValue(attr as any);
    }
    return json;
  }

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
  static async getUsers(onlyIncludePublicAttrs: boolean = true, filter?: WhereOptions): Promise<User[]> {
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
    // FIXME: Roles should be modelled as a seperate table or outsourced to something like Active Directory
    // (that way additional roles can be added without updating the schema of this table)
    hasAdminRole: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
    //temp pre authentication
    password: { type: DataTypes.STRING },
    resetPasswordToken: { type: DataTypes.STRING },
    resetPasswordExpiry: { type: DataTypes.DATE },
    // FIXME: All users currently assigned to the same static mock avatar
    userAvatarURI: {
      type: DataTypes.VIRTUAL,
      get() {
        return ImageService.getUserAvatarURI('DEFAULT_AVATAR');
      }
    }
  },
  {
    sequelize: sequelize,
    modelName: 'user',
    tableName: 'users',
    freezeTableName: true,
    indexes: [{ fields: ['userId'], using: 'BTREE' }, { fields: ['username'], using: 'BTREE' }]
  }
);
