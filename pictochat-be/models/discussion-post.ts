import { Sequelize, Model, DataTypes, Op, FindOptions } from 'sequelize';
import { SequelizeConnectionService } from '../services/sequelize-connection-service';
import { ImageService } from '../services/image-service';
import { User } from './user';
import { Literal } from 'sequelize/types/lib/utils';

const sequelize: Sequelize = SequelizeConnectionService.getInstance();

export class DiscussionPost extends Model {
  static readonly PUBLIC_ATTRIBUTES = [
    'postId',
    'discussionId',
    'isRootPost',
    'imageId',
    'imageSrc',
    'authorId',
    // 'author',
    'postedDate',
    'parentPostId',
    'replyTreePath'
  ];
  // static readonly ROOT_POST_ATTRIBUTES = [
  //   'postId',
  //   'discussionId',
  //   'postedDate',
  //   'imageSrc',
  //   'author',
  //   'imageId',
  //   'authorId',
  //   'imageSrc'
  // ];

  postId!: number;
  discussionId!: string;
  isRootPost!: boolean;
  postedDate!: Date;
  parentPostId!: number;
  commentTreePath!: string;
  imageId!: string;
  authorId!: number;
  replyTreePath!: string;
  // Attributes for 'has' associations
  author?: User;
  //author?: { userName: string; userAvatarURI: string }; // FIXME: currently mocked - Jordan

  // STATIC/COLLECTION METHODS

  /**
   * Wrapper for Sequelize Model.findAll that ensures author data is included in the result
   * and only returns PUBLIC_ATTRIBUTES by default. */
  static async findDiscussionPosts(options: FindOptions = {}): Promise<DiscussionPost[]> {
    const userJoin = { model: User, as: 'author', required: true, attributes: User.PUBLIC_ATTRIBUTES };
    const optionDefaults = {
      include: [userJoin],
      attributes: DiscussionPost.PUBLIC_ATTRIBUTES
    };
    options = { ...optionDefaults, ...options };
    // if (!!options) {
    //   if (!options.include) { options['include'] = optionDefaults.include; }
    //   if (!options.attributes) { options['attributes'] = optionDefaults.attributes; }
    //   return await DiscussionPost.findAll(options);
    // }
    return await DiscussionPost.findAll(options);
  }

  /**
   * Wrapper for Model.findOne that ensures auther data is included in result
   * and only returns PUBLIC_ATTRIBUTES by default. */
  static async findDiscussionPost(postId: number, options: FindOptions = {}): Promise<DiscussionPost> {
    const userJoin = { model: User, as: 'author', required: true, attributes: User.PUBLIC_ATTRIBUTES };
    const optionDefaults = {
      include: [userJoin],
      attributes: DiscussionPost.PUBLIC_ATTRIBUTES,
      where: { postId }
    };
    options = { ...optionDefaults, ...options };
    return await DiscussionPost.findOne(options);
    // if (!!options) {
    //   if (!options.include) { options['include'] = [userJoin]; }
    //   // if (!options.attributes) { options['attributes'] = DiscussionPost.PUBLIC_ATTRIBUTES; }

    //   let existingFilter = options['where'] || {};
    //   options['where'] = { ...existingFilter, ...filter };

    //   return await DiscussionPost.findOne(options);
    // }
    // return await DiscussionPost.findOne({ where: filter });
  }


  // static async getPathOrderedPostsInThread(discussionId: number): Promise<DiscussionPost[]> {
  //   return DiscussionPost.findAll({
  //     attributes: { include: DiscussionPost.PUBLIC_ATTRIBUTES },
  //     where: { discussionId: discussionId },
  //     order: [['replyTreePath', 'ASC']],
  //     include: [{ all: true }]
  //   });
  // }

  static async getPathOrderedSubTreeUnder(postId: number): Promise<DiscussionPost[]> {
    const rootPost = await DiscussionPost.findDiscussionPost(postId);
    console.log('rootPost: ', rootPost.toJSON());
    // const rootPost: DiscussionPost = await DiscussionPost.findOne({
    //   attributes: DiscussionPost.PUBLIC_ATTRIBUTES,
    //   where: { postId },
    //   include: [userJoin]
    // });

    const replyPathPrefix: string = rootPost.getReplyPathPrefix();
    let posts: DiscussionPost[] = await DiscussionPost.findDiscussionPosts({
      where: DiscussionPost.replyTreePathFilter(replyPathPrefix),
      order: [['replyTreePath', 'ASC'], ['postId', 'ASC']]
    });
    // let posts: DiscussionPost[] = await DiscussionPost.findAll({
    //   attributes: { include: DiscussionPost.PUBLIC_ATTRIBUTES },
    //   where: DiscussionPost.replyTreePathFilter(replyPathPrefix),
    //   order: [['replyTreePath', 'ASC'], ['postId', 'ASC']],
    //   include: [userJoin]
    // });

    posts.unshift(rootPost);

    return posts;
  }

  /**
   * @returns Sequelize where clause condition for getting rootPosts */
  static isRootPostFilter(): { [fieldName: string]: any } {
    return { isRootPost: true };
  }

  /**
   * @returns Sequelize where clause condition for finding posts under the specified path prefix */
  private static replyTreePathFilter(prefix: string) {
    return { replyTreePath: { [Op.like]: `${prefix}/%` } };
  }

  // INSTANCE METHODS

  /**
   * Number of replies made to this post or to replies of this post and so on
   * (number of nodes under this node in the reply tree).
   *
   * NOTE: This isn't a virtual column because its expensive to compute and best
   *       not included in every toJSON call.
   */
  async getDeepReplyCount(): Promise<number> {
    return DiscussionPost.count({
      where: { replyTreePath: { [Op.like]: this.getReplyPathPrefix() + '/%' } }
    });
  }

  private getReplyPathPrefix(): string {
    const replyTreePath = this.getDataValue('replyTreePath');
    return `${replyTreePath || ''}${this.getDataValue('postId')}`;
    // return replyTreePath !== null
    //   ? `${replyTreePath || ''}${this.getDataValue('postId')}`
    //   : `${this.getDataValue('postId')}`;
  }
}

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
    imageSrc: {
      type: DataTypes.VIRTUAL,
      get() {
        return ImageService.getImageURI(this.getDataValue('imageId'));
      }
    }/*,
    author: {
      type: DataTypes.VIRTUAL,
      get() {
        // FIXME: MOCK DATA
        return { userName: 'Doss', userAvatarURI: ImageService.getImageURI('4') };
      }
    }*/
  },
  {
    sequelize: sequelize,
    modelName: 'discussionPost',
    tableName: 'discussion_posts',
    freezeTableName: true,
    indexes: [
      { fields: ['discussionId'], using: 'BTREE' }
    ]
  }
);

DiscussionPost.belongsTo(DiscussionPost,
  { as: 'parentPost', foreignKey: 'parentPostId', targetKey: 'postId', constraints: false });
DiscussionPost.belongsTo(User,
  { targetKey: 'userId', foreignKey: 'authorId', constraints: true, as: 'author' });

