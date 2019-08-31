import { Sequelize, Model, DataTypes } from 'sequelize';
import { SequelizeConnectionService } from '../services/sequelize-connection-service';
import { ImageService } from '../services/image-service';

const sequelize: Sequelize = SequelizeConnectionService.getInstance();

export class DiscussionPost extends Model {
  static readonly ROOT_POST_ATTRIBUTES = ['postId', 'discussionId', 'imageId', 'authorId', 'postedDate', 'imageURI'];
  postId!: number;
  discussionId!: number;
  isRootPost!: boolean;
  imageId!: string;
  authorId!: number;
  postedDate!: Date;
  parentPostId!: number;
}

DiscussionPost.init(
  {
    postId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    discussionId: { type: DataTypes.INTEGER },
    isRootPost: { type: DataTypes.BOOLEAN, defaultValue: false },
    imageId: { type: DataTypes.STRING },
    authorId: { type: DataTypes.INTEGER },
    postedDate: { type: DataTypes.DATE },
    parentPostId: { type: DataTypes.INTEGER },
    imageURI: {
      type: DataTypes.VIRTUAL,
      get() {
        return ImageService.getImageURI(this.imageId);
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

// import mongoose from "mongoose";

// const discussionPostSchema = new mongoose.Schema({
//   discussionId: String,
//   parentPostId: String,
//   isRootPost: Boolean, // true if the post if discussion's root post
//   imageId: String, // will be used to get image by calling /api/post/image/{:imageId}
//   authorId: String, // ObjectID for author's user document
//   createdDatetime: Date // really a data-time object
// });

// export const DiscussionPost = mongoose.model(
//   "DiscussionPost",
//   discussionPostSchema
// );
