import { Sequelize, Model, DataTypes, Op, FindOptions, CountOptions, OrderItem } from 'sequelize';
import { SequelizeConnectionService } from '../services/sequelize-connection-service';
import { ImageService } from '../services/image-service';
import { User } from './user';
import { DiscussionPostRepo } from '../repositories/discussion-post-repo';

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
    'hasInappropriateFlag',
    'reactionsCount'
  ];

  postId: number;
  discussionId: string;
  isRootPost: boolean;
  postedDate: Date;
  parentPostId: number;
  commentTreePath: string;
  imageId: string;
  authorId: number;
  replyTreePath: string;
  isHidden: boolean;
  isDeleted: boolean;
  hasInappropriateFlag: boolean;
  reactionsCount: number;

  // Attributes for associations
  author?: User;

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
    return replyCount === 0 && this.reactionsCount === 0;
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
    return await DiscussionPostRepo.count({
      where: { replyTreePath: { [Op.like]: this.getReplyPathPrefix() + '/%' } }
    });
  }

  async getDirectReplyCount(): Promise<number> {
    return await DiscussionPostRepo.count({ where: { parentPostId: this.postId } });
  }

  /**
   * @returns A prefix for the replyTreePath values of all descendants of the current node. */
  getReplyPathPrefix(): string {
    const replyTreePath = this.replyTreePath;
    return `${replyTreePath || ''}${this.postId}`;
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
    reactionsCount: { type: DataTypes.INTEGER, defaultValue: 0 },
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
      { fields: ['hasInappropriateFlag'], using: 'BTREE' },
      { fields: ['isDeleted', 'isHidden'], using: 'BTREE' }
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
