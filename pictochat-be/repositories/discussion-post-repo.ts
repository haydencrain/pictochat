import { DiscussionPost } from '../models/discussion-post';
import { FindOptions, Op, CountOptions, OrderItem } from 'sequelize';
import { SortValue, SortTypes } from '../utils/sort-types';
import { User } from '../models/user';

export class DiscussionPostRepo {
  private static readonly USER_JOIN = { model: User, as: 'author', required: true, attributes: User.PUBLIC_ATTRIBUTES };

  static async incrementReactionsCount(postId: number): Promise<DiscussionPost> {
    return await DiscussionPost.increment({ reactionsCount: 1 }, { where: { postId } });
  }

  static async decrementReactionsCount(postId: number): Promise<DiscussionPost> {
    return await DiscussionPost.increment({ reactionsCount: -1 }, { where: { postId } });
  }

  /**
   * Wrapper for Sequelize Model.findAll that ensures author data is included in the result
   * and only returns PUBLIC_ATTRIBUTES by default. */
  static async getDiscussionPosts(options: FindOptions = {}): Promise<DiscussionPost[]> {
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

  static async getDiscussionRootPosts(sortType: SortValue): Promise<DiscussionPost[]> {
    const rootPosts = await DiscussionPostRepo.getDiscussionPosts({
      where: DiscussionPostRepo.isRootPostFilter(),
      order: [DiscussionPostRepo.getSortByValue(sortType)]
    });
    return rootPosts;
  }

  static async getDiscussionPost(postId: number, options: FindOptions = {}): Promise<DiscussionPost> {
    options['where'] = { ...(options['where'] || {}), postId };
    return await DiscussionPostRepo.findOne(options);
  }

  static async getDiscussionRoot(discussionId: string, options: FindOptions = {}): Promise<DiscussionPost> {
    const existingFilter = options['where'] || {};
    options['where'] = {
      ...existingFilter,
      ...DiscussionPostRepo.isRootPostFilter(),
      discussionId
    };
    return await DiscussionPostRepo.findOne(options);
  }

  /**
   * Get all replies (and replies of replies) to the specified postId, ordered
   * such that parent posts always come before their replies (aka pre-order traversal order). */
  static async getPathOrderedSubTreeUnder(
    rootPost: DiscussionPost,
    sortType: SortValue = ''
  ): Promise<DiscussionPost[]> {
    const order = DiscussionPostRepo.getSortByValue(sortType);
    const replyPathPrefix: string = rootPost.getReplyPathPrefix();
    let posts: DiscussionPost[] = await DiscussionPostRepo.getDiscussionPosts({
      where: { ...DiscussionPostRepo.replyTreePathFilter(replyPathPrefix), ...DiscussionPostRepo.defaultFilter() },
      order: [['replyTreePath', 'ASC'], order]
    });
    return posts;
  }

  /**
   * @returns Sequelize where clause condition for getting rootPosts */
  static isRootPostFilter(): { [fieldName: string]: any } {
    return { isRootPost: true };
  }

  /** @returns Default WHERE condition applied to all queries */
  static defaultFilter() {
    return { isDeleted: false };
  }

  /**
   * @returns Sequelize where clause condition for finding posts under the specified path prefix */
  private static replyTreePathFilter(prefix: string) {
    return { replyTreePath: { [Op.like]: `${prefix}/%` } };
  }

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

  static async count(options?: CountOptions) {
    options['where'] = { ...(options['where'] || {}), ...DiscussionPostRepo.defaultFilter() };
    return await DiscussionPost.count(options);
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
}
