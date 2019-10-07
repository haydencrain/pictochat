import { Sequelize, Model, DataTypes, Op, FindOptions, CountOptions } from 'sequelize';
import { SequelizeConnectionService } from '../services/sequelize-connection-service';
import { ImageService } from '../services/image-service';
import { User } from './user';

const sequelize: Sequelize = SequelizeConnectionService.getInstance();

export class DiscussionPost extends Model {
  static readonly PUBLIC_ATTRIBUTES = [
    'postId',
    'discussionId',
    'isRootPost',
    'imageId',
    'imageSrc',
    'authorId',
    'postedDate',
    'parentPostId',
    'replyTreePath',
    'isHidden',
    'isDeleted',
    'hasInappropriateContentFlag'
  ];
  private static readonly USER_JOIN = { model: User, as: 'author', required: true, attributes: User.PUBLIC_ATTRIBUTES };

  postId!: number;
  discussionId!: string;
  isRootPost!: boolean;
  postedDate!: Date;
  parentPostId!: number;
  commentTreePath!: string;
  imageId!: string;
  authorId!: number;
  replyTreePath!: string;
  isHidden!: boolean;
  isDeleted!: boolean;
  hasInappropriateFlag!: boolean;

  // Attributes for associations
  author?: User;

  //// INSTANCE METHODS ////

  hide() {
    this.isHidden = true;
  }

  setDeleted() {
    this.isDeleted = true;
  }

  setInappropriateContentFlag(value: boolean) {
    this.hasInappropriateFlag = value;
  }

  async isUpdatable(): Promise<boolean> {
    let replyCount: number = await this.getDirectReplyCount();
    // TODO: Check if the post has any reactions
    return replyCount === 0;
  }

  async isDeleteable(): Promise<boolean> {
    let replyCount: number = await this.getDirectReplyCount();
    return replyCount === 0;
  }

  /**
   * Number of replies made to this post or to replies of this post and so on
   * (number of nodes under this node in the reply tree).
   *
   * NOTE: This isn't a virtual column because its expensive to compute and best not
   *   included in every toJSON call. */
  async getDeepReplyCount(): Promise<number> {
    return DiscussionPost._count({
      where: { replyTreePath: { [Op.like]: this.getReplyPathPrefix() + '/%' } }
    });
  }

  async getDirectReplyCount(): Promise<number> {
    const filter = { where: { parentPostId: this.getDataValue('postId') } };
    return await DiscussionPost._count(filter);
  }

  /**
   * @returns A prefix for the replyTreePath values of all descendants of the current node. */
  private getReplyPathPrefix(): string {
    const replyTreePath = this.getDataValue('replyTreePath');
    return `${replyTreePath || ''}${this.getDataValue('postId')}`;
  }

  //// STATIC/COLLECTION METHODS ////

  /**
   * Wrapper for Sequelize Model.findAll that ensures author data is included in the result
   * and only returns PUBLIC_ATTRIBUTES by default. */
  static async getDiscussionPosts(options: FindOptions = {}): Promise<DiscussionPost[]> {
    const defaultFilters = DiscussionPost.defaultFilter();
    const optionDefaults = {
      include: [DiscussionPost.USER_JOIN],
      attributes: DiscussionPost.PUBLIC_ATTRIBUTES
    };
    options['where'] = { ...(options['where'] || {}), ...defaultFilters };
    options = { ...optionDefaults, ...options };
    return await DiscussionPost.findAll(options);
  }

  static async getDiscussionPost(postId: number, options: FindOptions = {}): Promise<DiscussionPost> {
    options['where'] = { ...(options['where'] || {}), postId };
    return await DiscussionPost._findOne(options);
  }

  static async getDiscussionRoot(discussionId: string, options: FindOptions = {}): Promise<DiscussionPost> {
    const existingFilter = options['where'] || {};
    options['where'] = {
      ...existingFilter,
      ...DiscussionPost.isRootPostFilter(),
      discussionId
    };
    return await DiscussionPost._findOne(options);
  }

  /**
   * Get all replies (and replies of replies) to the specified postId, ordered
   * such that parent posts always come before their replies (aka pre-order traversal order). */
  static async getPathOrderedSubTreeUnder(rootPost: DiscussionPost): Promise<DiscussionPost[]> {
    const replyPathPrefix: string = rootPost.getReplyPathPrefix();
    let posts: DiscussionPost[] = await DiscussionPost.getDiscussionPosts({
      where: { ...DiscussionPost.replyTreePathFilter(replyPathPrefix), ...DiscussionPost.defaultFilter() },
      order: [['replyTreePath', 'ASC'], ['postId', 'ASC']]
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
  private static async _findOne(options: FindOptions = {}) {
    const filterDefaults = DiscussionPost.defaultFilter();
    const optionDefaults = {
      include: [DiscussionPost.USER_JOIN],
      attributes: DiscussionPost.PUBLIC_ATTRIBUTES
    };
    options['where'] = { ...(options['where'] || {}), ...filterDefaults };
    options = { ...optionDefaults, ...options };
    return await DiscussionPost.findOne(options);
  }

  private static async _count(options?: CountOptions) {
    options['where'] = { ...(options['where'] || {}), ...DiscussionPost.defaultFilter() };
    return await DiscussionPost.count(options);
  }
}

//// SCHEMA DEFINITION ////

DiscussionPost.init(
  {
    postId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    discussionId: { type: DataTypes.STRING, allowNull: false },
    isRootPost: { type: DataTypes.BOOLEAN, defaultValue: false },
    imageId: { type: DataTypes.STRING, allowNull: false },
    authorId: { type: DataTypes.INTEGER, allowNull: false },
    postedDate: { type: DataTypes.DATE, allowNull: false },
    parentPostId: { type: DataTypes.INTEGER },
    replyTreePath: { type: DataTypes.STRING },
    isHidden: { type: DataTypes.BOOLEAN, defaultValue: false },
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    hasInappropriateFlag: { type: DataTypes.BOOLEAN, defaultValue: false },
    imageSrc: {
      type: DataTypes.VIRTUAL,
      get() {
        return ImageService.getImageURI(this.getDataValue('imageId'));
      }
    }
  },
  {
    sequelize: sequelize,
    modelName: 'discussionPost',
    tableName: 'discussion_posts',
    freezeTableName: true,
    indexes: [
      { fields: ['discussionId', 'postId'], using: 'BTREE' },
      { fields: ['hasInappropriateContentFlag'], using: 'BTREE' }
    ]
  }
);

//// ASSOCIATIONS ////

DiscussionPost.belongsTo(DiscussionPost, {
  as: 'parentPost',
  foreignKey: 'parentPostId',
  targetKey: 'postId',
  constraints: false
});

DiscussionPost.belongsTo(User, { targetKey: 'userId', foreignKey: 'authorId', constraints: true, as: 'author' });
