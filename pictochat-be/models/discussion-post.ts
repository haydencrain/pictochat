import { Sequelize, Model, DataTypes, Op } from 'sequelize';
import { SequelizeConnection } from '../utils/sequelize-connection';
import { ImageService } from '../services/image-service';
import { User } from './user';
import { DiscussionPostRepo } from '../repositories/discussion-post-repo';

const sequelize: Sequelize = SequelizeConnection.getInstance();

export class DiscussionPost extends Model {
  /**
   * Attributes exposed outside of this class */
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

  /**
   * Sets a flag that tells clients to consider the content of this post hidden
   */
  hide() {
    this.isHidden = true;
  }

  /**
   * Delete this post
   */
  setDeleted() {
    this.isDeleted = true;
  }

  /**
   * Flags a post as having inappropraite content (e.g. text, content not appropirate for general audience)
   */
  setInappropriateFlag(value: boolean) {
    this.hasInappropriateFlag = value;
  }

  /**
   * Checks whether the content of this post can be edited
   */
  async isUpdatable(): Promise<boolean> {
    let replyCount: number = await this.getDirectReplyCount();
    return replyCount === 0 && this.reactionsCount === 0;
  }

  /**
   * Checks whether this post can be deleted
   */
  async isDeleteable(): Promise<boolean> {
    let replyCount: number = await this.getDirectReplyCount();
    return replyCount === 0;
  }

  /**
   * Number of replies made to this post or to replies of this post and so on
   * (number of nodes under this node in the reply tree).
   */
  async getDeepReplyCount(): Promise<number> {
    return await DiscussionPostRepo.count({
      where: { replyTreePath: { [Op.like]: this.getReplyPathPrefix() + '/%' } }
    });
  }

  /** Get the number of direct replies */
  async getDirectReplyCount(): Promise<number> {
    return await DiscussionPostRepo.count({ where: { parentPostId: this.postId } });
  }

  /**
   * Get a prefix for the replyTreePath values of all descendants of the current node. */
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
      { fields: ['isDeleted', 'isHidden'], using: 'BTREE' },
      // Supports counts of posts by user; excluding deleted/hidden posts
      { fields: ['authorId', 'isHidden', 'isDeleted', 'postId'], using: 'BTREE' }
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
