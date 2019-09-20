import { Sequelize, Model, DataTypes, Op } from 'sequelize';
import { SequelizeConnectionService } from '../services/sequelize-connection-service';
import { ImageService } from '../services/image-service';

const sequelize: Sequelize = SequelizeConnectionService.getInstance();

export class DiscussionPost extends Model {
  static readonly PUBLIC_ATTRIBUTES = [
    'postId',
    'discussionId',
    'isRootPost',
    'imageId',
    'imageSrc',
    'authorId',
    'author',
    'postedDate',
    'parentPostId',
    'replyTreePath'
  ];
  static readonly ROOT_POST_ATTRIBUTES = [
    'postId',
    'discussionId',
    'postedDate',
    'imageSrc',
    'author',
    'imageId',
    'authorId',
    'imageSrc'
  ];

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
  author?: { userName: string; userAvatarURI: string }; // FIXME: currently mocked - Jordan

  // STATIC/COLLECTION METHODS

  static async getPathOrderedPostsInThread(discussionId: number): Promise<DiscussionPost[]> {
    return DiscussionPost.findAll({
      attributes: { include: DiscussionPost.PUBLIC_ATTRIBUTES },
      where: { discussionId: discussionId },
      order: [['replyTreePath', 'ASC']]
    });
  }

  static async getPathOrderedSubTreeUnder(postId: number): Promise<DiscussionPost[]> {
    const rootPost: DiscussionPost = await DiscussionPost.findOne({ where: { postId } });
    const rootReplyTreePath = rootPost.getDataValue('replyTreePath');
    const replyPathPrefix: string = rootPost.getReplyPathPrefix();
    let posts = await DiscussionPost.findAll({
      attributes: { include: DiscussionPost.PUBLIC_ATTRIBUTES },
      where: { ...DiscussionPost.replyTreePathFilter(replyPathPrefix) },
      order: [['replyTreePath', 'ASC'], ['postId', 'ASC']]
    });
    posts.unshift(rootPost);
    console.log(posts.map(post => post.toJSON()));
    return posts;
  }

  /**
   * Returns a Sequelize where clause condition of the form {fieldName: condition}
   * for retireving root posts */
  static isRootPostFilter(): { [fieldName: string]: any } {
    return { isRootPost: true };
  }

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
    return replyTreePath !== null
      ? `${replyTreePath || ''}${this.getDataValue('postId')}`
      : `${this.getDataValue('postId')}`;
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
    },
    author: {
      type: DataTypes.VIRTUAL,
      get() {
        // FIXME: MOCK DATA
        return { userName: 'Doss', userAvatarURI: ImageService.getImageURI('4') };
      }
    }
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

DiscussionPost.belongsTo(DiscussionPost, { foreignKey: 'parentPostId', targetKey: 'postId', constraints: false });
