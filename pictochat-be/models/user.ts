import { Sequelize, Model, DataTypes, WhereOptions } from 'sequelize';
import { SequelizeConnectionService } from '../services/sequelize-connection-service';
import { ImageService } from '../services/image-service';
import { NotFoundError } from '../exceptions/not-found-error';

const sequelize: Sequelize = SequelizeConnectionService.getInstance();

export class User extends Model {
  static readonly PUBLIC_ATTRIBUTES = ['userId', 'email', 'username', 'userAvatarURI', 'hasAdminRole'];
  static readonly PUBLIC_TABLE_COLUMNS = ['userId', 'email', 'username', 'hasAdminRole']; // Everything from PUBLIC_ATTRIBUTES excluding virtual columns

  userId!: number;
  username!: string;
  password!: string;
  email: string;
  hasAdminRole: boolean;
  //temp pre authentication
  resetPasswordToken: string;
  resetPasswordExpiry: Date;
  isDisabled: boolean;

  disable() {
    this.isDisabled = true;
  }

  enable() {
    this.isDisabled = true;
  }

  /**
   * @returns JSON with only PUBLIC_ATTRIBUTES */
  getPublicJSON(): any {
    let json = {};
    for (let attr of User.PUBLIC_ATTRIBUTES) {
      json[attr] = this.get(attr);
      // json[attr] = this.getDataValue(attr as any);
    }
    return json;
  }
  /**
   * Checks if the user is disabled
   * @param includeDisabled
   */
  static defaultFilter(includeDisabled: boolean = false) {
    let filter = {};
    if (!includeDisabled) {
      filter['isDisabled'] = false;
    }
    return filter;
  }

  /**
   * CREATE user
   * @param username
   * @param hashedPassword
   */
  static async createUser(username: string, hashedPassword: string): Promise<User> {
    return await User.create({ username, password: hashedPassword });
  }
  /**
   * GET user by `username` and filter the search based on `includeDisabled`
   * @param username
   * @param includeDisabled
   */
  static async getUserByUsername(username: string, includeDisabled: boolean = false): Promise<User> {
    const user = await User.findOne({
      attributes: {
        include: User.PUBLIC_ATTRIBUTES
      },
      where: { username, ...User.defaultFilter(includeDisabled) }
    });
    // if (user === null || user === undefined) {
    //   throw new NotFoundError();
    // }
    return user;
  }

  /**
   * GET user based on `userId` and filter the search based on `onlyIncludePublicAttrs`
   * and `includeDisabled`
   * @param userId
   * @param onlyIncludePublicAttrs When true, only fields in User.PUBLIC_ATTRIBUTES will be
   *    included in the returned object.
   * @returns a User instance with the specified userId
   */
  static async getUser(
    userId: number,
    onlyIncludePublicAttrs: boolean = true,
    includeDisabled: boolean = false
  ): Promise<User> {
    let queryParams = { where: { userId, ...User.defaultFilter(includeDisabled) } };
    if (onlyIncludePublicAttrs) {
      queryParams['attributes'] = { include: User.PUBLIC_ATTRIBUTES };
    }
    const user = await User.findOne(queryParams);
    // if (user === null || user === undefined) {
    //   throw new NotFoundError();
    // }
    return user;
  }

  /**
   * GET users based on `onlyIncludePublicAttrs` and `filter`
   * @param onlyIncludePublicAttrs When true, only fields in User.PUBLIC_ATTRIBUTES will be
   *    included in the returned object. */
  static async getUsers(onlyIncludePublicAttrs: boolean = true, filter?: WhereOptions): Promise<User[]> {
    let queryParams = { order: ['userId'], where: User.defaultFilter() };
    if (onlyIncludePublicAttrs) {
      queryParams['attributes'] = { include: User.PUBLIC_ATTRIBUTES };
    }
    const users = User.findAll(queryParams);
    // if (users === null || users === undefined) {
    //   throw new NotFoundError();
    // }
    return users;
  }
}

User.init(
  {
    userId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING },
    username: { type: DataTypes.STRING, unique: true },
    isDisabled: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
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
    // paranoid: true,
    indexes: [{ fields: ['userId'], using: 'BTREE' }, { fields: ['username'], using: 'BTREE' }]
  }
);
