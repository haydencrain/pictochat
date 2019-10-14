import { User } from "../models/user";
import { WhereOptions } from "sequelize/types";

export class UserRepo {

  static defaultFilter(includeDisabled: boolean = false) {
    let filter = {};
    if (!includeDisabled) {
      filter['isDisabled'] = false;
    }
    return filter;
  }

  static async createUser(username: string, hashedPassword: string): Promise<User> {
    return await User.create({ username, password: hashedPassword });
  }

  static async getUserByUsername(username: string, includeDisabled: boolean = false): Promise<User> {
    const user = await User.findOne({
      attributes: {
        include: User.PUBLIC_ATTRIBUTES
      },
      where: { username, ...UserRepo.defaultFilter(includeDisabled) }
    });
    // if (user === null || user === undefined) {
    //   throw new NotFoundError();
    // }
    return user;
  }

  /**
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
    let queryParams = { where: { userId, ...UserRepo.defaultFilter(includeDisabled) } };
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
   * @param onlyIncludePublicAttrs When true, only fields in User.PUBLIC_ATTRIBUTES will be
   *    included in the returned object. */
  static async getUsers(onlyIncludePublicAttrs: boolean = true, filter?: WhereOptions): Promise<User[]> {
    let queryParams = { order: ['userId'], where: UserRepo.defaultFilter() };
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
