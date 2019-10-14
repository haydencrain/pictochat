// import { Model, DataTypes } from 'sequelize';
// import { SequelizeConnectionService } from '../services/sequelize-connection-service';
// import { DiscussionPost } from './discussion-post';

// export class ContentReport {
//   post: DiscussionPost;

//   constructor(post: DiscussionPost) {
//     this.post = post;
//   }

//   toJSON(): any {
//     // return { postId: this.post.postId, hasInappropriateFlag: this.post.hasInappropriateFlag };
//   }
// }

// const sequelize = SequelizeConnectionService.getInstance();

// class ContentReport extends Model {
//   contentReportId: number;
//   postId: number;
//   comment: string;
//   // imageAtReportTimeId: string;
//   reportedTimestamp: Date;

//   // COLLECTIONS/INSTANCE METHODS
// }

// ContentReport.init(
//   {
//     contentReportId: { type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true },
//     postId: { type: DataTypes.NUMBER, allowNull: false },
//     comment: { type: DataTypes.TEXT },
//     reportedTimestamp: { type: DataTypes.DATE, allowNull: false }
//   },
//   { sequelize, modelName: 'ContentReport', tableName: 'content_reports', freezeTableName: true }
// );

// ContentReport.belongsTo(DiscussionPost, { as: 'post', targetKey: 'postId', foreignKey: 'postId', constraints: true });
