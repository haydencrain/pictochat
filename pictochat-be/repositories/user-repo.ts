import { User } from "../models/user";
import { Op, WhereOptions } from "sequelize";

export class UserRepo {

  /**
   * Default WHERE condition for queries that get users.
   * @param includeDisabled Whether to include disabled users
   */
  static defaultFilter(includeDisabled: boolean = false): WhereOptions {
    let filter = {};
    if (!includeDisabled) {
      filter['isDisabled'] = false;
    }
    return filter;
  }

  /**
   * @param username
   * @param hashedPassword A bcrypt hashed password
   */
  static async createUser(username: string, hashedPassword: string): Promise<User> {
    return await User.create({ username, password: hashedPassword });
  }

  /**
   * @param username
   * @param includeDisabled When true, the specified user will be returned even if disabled.
   */
  static async getUserByUsername(username: string, includeDisabled: boolean = false): Promise<User> {
    const user = await User.findOne({
      attributes: {
        include: User.PUBLIC_ATTRIBUTES
      },
      where: { username, ...UserRepo.defaultFilter(includeDisabled) }
    });
    return user;
  }

  /**
   * @param userId
   * @param onlyIncludePublicAttrs When true, only fields in User.PUBLIC_ATTRIBUTES will be
   *    included in the returned object.
   * @param includeDisabled When true, the specified user will be returned even if disabled.
   * @returns a User instance with the specified userId
   */
  static async getUser(
    userId: number,
    onlyIncludePublicAttrs: boolean = true,
    includeDisabled: boolean = false
  ): Promise<User> {
    let queryParams = { where: { userId, ...UserRepo.defaultFilter(includeDisabled) } };
    if (onlyIncludePublicAttrs) {
      queryParams['attributes'] = { include: User.PUBLIC_ATTRIBUTES };
    }
    const user = await User.findOne(queryParams);
    return user;
  }

  /**
   * @param onlyIncludePublicAttrs When true, only fields in User.PUBLIC_ATTRIBUTES will be
   *    included in the returned object.
   * @param userIds if provided, limits the results to users with the specifeid userIds
   */
  static async getUsers(onlyIncludePublicAttrs: boolean = true, userIds?: number[]): Promise<User[]> {
    let queryParams = {
      where: UserRepo.defaultFilter()
    };

    if (userIds !== undefined) {
      queryParams['where'] = {
        ...queryParams['where'],
        ...{ userId: { [Op.in]: userIds } }
      };
    }

    if (onlyIncludePublicAttrs) {
      queryParams['attributes'] = { include: User.PUBLIC_ATTRIBUTES };
    }

    const users = User.findAll(queryParams);
    return users;
  }
}
