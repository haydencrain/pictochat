import { DiscussionPost } from '../models/discussion-post';
import { FindOptions, Op, CountOptions, OrderItem, WhereOptions } from 'sequelize';
import { SortValue, SortTypes } from '../utils/sort-types';
import { User } from '../models/user';

export class DiscussionPostRepo {
  private static readonly USER_JOIN = { model: User, as: 'author', required: true, attributes: User.PUBLIC_ATTRIBUTES };

  /**
   * Wrapper for Sequelize Model.findAll that ensures author data is included in the result
   * and only returns PUBLIC_ATTRIBUTES by default. */
  static async findAll(options: FindOptions = {}): Promise<DiscussionPost[]> {
    const defaultFilters = DiscussionPostRepo.defaultFilter();
    const optionDefaults = {
      include: [DiscussionPostRepo.USER_JOIN],
      attributes: DiscussionPost.PUBLIC_ATTRIBUTES
    };
    options['where'] = {
      ...(options['where'] || {}),
      ...defaultFilters
    };
    options = {
      ...optionDefaults,
      ...options
    };
    return await DiscussionPost.findAll(options);
  }

  /**
   * Get the root post for each discussion
   * @param sortType the sorting strategy to use
   */
  static async getRootPosts(sortType: SortValue): Promise<DiscussionPost[]> {
    const rootPosts = await DiscussionPostRepo.findAll({
      where: DiscussionPostRepo.isRootPostFilter(),
      order: [DiscussionPostRepo.getSortByValue(sortType)]
    });
    return rootPosts;
  }

  /**
   * Gets posts that have been flaged as inappropriate
   */
  static async getFlaggedPosts(): Promise<DiscussionPost[]> {
    return await DiscussionPostRepo.findAll({
      where: { hasInappropriateFlag: true, isHidden: false, isDeleted: false }
    });
  }

  /**
   * @param postId
   */
  static async getDiscussionPost(postId: number): Promise<DiscussionPost> {
    const options = { where: { postId } };
    return await DiscussionPostRepo.findOne(options);
  }

  /**
   * Get the root post for the specified discussion/thread specified discussionId
   * @param discussionId
   */
  static async getDiscussionRoot(discussionId: string): Promise<DiscussionPost> {
    let options = {
      where: { ...DiscussionPostRepo.isRootPostFilter(), discussionId }
    };
    return await DiscussionPostRepo.findOne(options);
  }

  /**
   * Get all replies (and replies of replies) to the specified postId, ordered
   * such that parent posts always come before their replies (i.e. the pre-order traversal visit order).
   * @param rootPost the root of the sub-tree
   * @param sortType the sorting strategy to use; determines the relative order of the direct
   *    replies to each post.
   */
  static async getPathOrderedSubTreeUnder(
    rootPost: DiscussionPost,
    sortType: SortValue = ''
  ): Promise<DiscussionPost[]> {
    const order = DiscussionPostRepo.getSortByValue(sortType);
    const replyPathPrefix: string = rootPost.getReplyPathPrefix();
    let posts: DiscussionPost[] = await DiscussionPostRepo.findAll({
      where: { ...DiscussionPostRepo.replyTreePathFilter(replyPathPrefix), ...DiscussionPostRepo.defaultFilter() },
      order: [['replyTreePath', 'ASC'], order]
    });
    return posts;
  }

  /**
   * @returns Sequelize where clause condition for finding posts under the specified path prefix */
  private static replyTreePathFilter(prefix: string) {
    return { replyTreePath: { [Op.like]: `${prefix}/%` } };
  }

  /** @returns Specific ORDER BY Depening on what value is passed in */
  private static getSortByValue(sortType: SortValue): OrderItem {
    switch (sortType) {
      // Order by reactions Descending
      case SortTypes.REACTIONS:
        return ['reactionsCount', 'DESC'];

      case SortTypes.NEW:
      case SortTypes.NONE:
        // note: comments also comes here as we can't sort here, we have to sort
        // manually once we compute the comment tree count.
        return ['postedDate', 'DESC'];

      default:
        return ['postedDate', 'DESC'];
    }
  }

  /* BASE SEQUELIZE QUERY OVERLOADS */

  /**
   * Wrapper for Model.findOne that ensures author data is included in result
   * and only returns PUBLIC_ATTRIBUTES by default. */
  static async findOne(options: FindOptions = {}) {
    const filterDefaults = DiscussionPostRepo.defaultFilter();
    const optionDefaults = {
      include: [DiscussionPostRepo.USER_JOIN],
      attributes: DiscussionPost.PUBLIC_ATTRIBUTES
    };
    options['where'] = { ...(options['where'] || {}), ...filterDefaults };
    options = { ...optionDefaults, ...options };
    return await DiscussionPost.findOne(options);
  }

  /**
   * Wrapper for Model.count that ensures default filters are applied
   */
  static async count(options?: CountOptions) {
    options['where'] = { ...(options['where'] || {}), ...DiscussionPostRepo.defaultFilter() };
    return await DiscussionPost.count(options);
  }

  /* REACTION COUNTS */

  static async incrementReactionsCount(postId: number): Promise<DiscussionPost> {
    return await DiscussionPost.increment({ reactionsCount: 1 }, { where: { postId } });
  }

  static async decrementReactionsCount(postId: number): Promise<DiscussionPost> {
    return await DiscussionPost.increment({ reactionsCount: -1 }, { where: { postId } });
  }

  /* FILTERS */

  /**
   * @returns Sequelize WHERE clause condition for getting rootPosts */
  static isRootPostFilter(): { [fieldName: string]: any } {
    return { isRootPost: true };
  }

  /** @returns Default WHERE condition applied to all queries */
  static defaultFilter(): WhereOptions {
    return { isDeleted: false };
  }
}
