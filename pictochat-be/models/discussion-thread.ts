import { Sequelize, DataTypes, Model } from 'sequelize';
import { SequelizeConnectionService } from '../services/sequelize-connection-service';
import { DiscussionPost } from './discussion-post';

const sequelize: Sequelize = SequelizeConnectionService.getInstance();


// HELPERS

// Thread with attributes for all of its 'has' associations populated
// export interface DiscussionThreadDocument extends DiscussionThread {
//   rootPostId: number;
//   discussionId: number;
//   rootPost: DiscussionPost;
//   allReplies: {postId: number}[]; // list of postIds for all replies, incl. replies to replies, etc.
// }


// MODEL

export class DiscussionThread extends Model {
  rootPostId!: number;
  discussionId!: number;

  // attributes for all of the 'has' associations
  rootPost?: DiscussionPost;
  allReplies?: { postId: number }[]; // list of postIds for all replies, incl. replies to replies, etc.

  /**
   * @returns Promise for a list for DiscussionThreads with rootPost and allReplies populated
   */
  static async getThreadsPopulated(): Promise<DiscussionThread[]> {
    let threads = await DiscussionThread.findAll({
      include: [
        {
          model: DiscussionPost,
          as: 'rootPost',
          required: true,
          attributes: DiscussionPost.ROOT_POST_ATTRIBUTES
        },
        { model: DiscussionPost, as: 'allReplies', attributes: ['postId'] }
      ]
    });
    return threads;
  }
}

DiscussionThread.init(
  {
    discussionId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rootPostId: { type: DataTypes.INTEGER, allowNull: false }
  },
  {
    sequelize,
    modelName: 'DiscussionThread',
    tableName: 'discussion_threads',
    freezeTableName: true,
    underscored: false
  }
);

DiscussionThread.hasOne(
  DiscussionPost,
  { as: 'rootPost', foreignKey: 'postId', sourceKey: 'rootPostId', constraints: false }
);
DiscussionThread.hasMany(
  DiscussionPost,
  { as: 'allReplies', foreignKey: 'discussionId', sourceKey: 'discussionId', constraints: false }
);
