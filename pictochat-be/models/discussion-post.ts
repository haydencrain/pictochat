import { Sequelize, Model, DataTypes } from 'sequelize';
import { SequelizeConnectionService } from '../services/sequelize-connection-service';
import { ImageService } from '../services/image-service';

const sequelize: Sequelize = SequelizeConnectionService.getInstance();

export class DiscussionPost extends Model {
  static readonly PUBLIC_ATTRIBUTES = ['postId', 'discussionId', 'isRootPost', 'imageSrc', 'author', 'postedDate', 'parentPostId', 'replyTreePath'];
  static readonly ROOT_POST_ATTRIBUTES = ['postId', 'discussionId', 'postedDate', 'imageSrc', 'author', 'imageId', 'authorId'];
  postId!: number;
  discussionId!: number;
  isRootPost!: boolean;
  postedDate!: Date;
  parentPostId!: number;
  commentTreePath!: string;
  imageId!: string;
  authorId!: number;

  // Attributes for 'has' associations
  author?: {userName: string, userAvatarURI: string} // FIXME: currently mocked - Jordan

  static async getPathOrderedPostsInThread(discussionId: number): Promise<DiscussionPost[]> {
    return DiscussionPost.findAll({
      attributes: {
        include: DiscussionPost.PUBLIC_ATTRIBUTES
      },
      where: { discussionId: discussionId },
      order: [['replyTreePath', 'ASC']]
    });
  }
}

DiscussionPost.init(
  {
    postId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    discussionId: { type: DataTypes.INTEGER },
    isRootPost: { type: DataTypes.BOOLEAN, defaultValue: false },
    imageId: { type: DataTypes.STRING }, // using a string so the id can be imageHash+uploadedDate
    authorId: { type: DataTypes.INTEGER },
    postedDate: { type: DataTypes.DATE },
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
        return { userName: 'Doss', userAvatarURI: ImageService.getImageURI('4') }
      }
    }
  },
  {
    sequelize: sequelize,
    modelName: 'discussionPost',
    tableName: 'discussion_posts',
    freezeTableName: true
  }
);

DiscussionPost.belongsTo(
  DiscussionPost,
  { foreignKey: 'parentPostId', targetKey: 'postId', constraints: false }
);
