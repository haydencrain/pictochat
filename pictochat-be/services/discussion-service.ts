import { DiscussionPost } from '../models/discussion-post';
import { DiscussionThread } from '../models/discussion-thread';
import { DiscussionThreadSummary } from '../models/discussion-thread-summary';
import { DiscussionTreeNode } from '../models/discussion-tree-node';
import { NewImage, ImageService } from '../services/image-service';
import { SequelizeConnectionService } from './sequelize-connection-service';
import { Transaction } from 'sequelize/types';
import { Image } from '../models/image';

// HELPER INTERFACES

export interface NewThread {
  userId: number,
  image: NewImage
}

export interface NewReply {
  userId: number;
  parentPostId: number;
  image: NewImage;
}

// SERVICE

export class DiscussionService {

  static async createThread(newThread: NewThread): Promise<DiscussionThread> {
    let sequelize = SequelizeConnectionService.getInstance();
    // FIXME: Move transaction management into model/data-access layer
    let transaction: Transaction;
    try {
      transaction = await sequelize.transaction();

      let image: Image = await ImageService.saveImage(newThread.image, transaction);
      let rootPost: DiscussionPost = await DiscussionPost.create({
        isRootPost: true,
        imageId: image.imageId,
        authorId: newThread.userId,
        postedDate: new Date()
      }, { transaction });

      let thread: DiscussionThread = await DiscussionThread.create(
        { rootPostId: rootPost.getDataValue('postId') }, { transaction });

      await rootPost.update(
        { discussionId: thread.getDataValue('discussionId') },
        { transaction, where: { postId: rootPost.getDataValue('postId') } });

      await transaction.commit();
      return thread;
    } catch (error) {
      if (transaction !== undefined) {
        transaction.rollback();
      }
      throw error;
    }
  }

  static async createReply(newPost: NewReply) {
    let sequelize = SequelizeConnectionService.getInstance();
    let transaction: Transaction;
    try {
      transaction = await sequelize.transaction();
      let image: Image = await ImageService.saveImage(newPost.image, transaction);
      let parentPost: DiscussionPost = await DiscussionPost.findOne(
        { transaction, where: { postId: newPost.parentPostId } });

      let reply: DiscussionPost = await DiscussionPost.create({
        discussionId: parentPost.getDataValue('discussionId'),
        imageId: image.getDataValue('imageId'),
        autorId: newPost.userId,
        postedDate: new Date(),
        parentPostId: parentPost.getDataValue('postId'),
        replyTreePath: `${parentPost.getDataValue('replyTreePath')}/${parentPost.getDataValue('postId')}`
      }, { transaction });

      await transaction.commit();
      return reply;
    } catch (error) {
      if (transaction !== undefined) {
        transaction.rollback();
      }
      throw error;
    }
  }

  /** Creates a list of summaries for each thread containing the rootPost
   *  and agggregate metrics (e.g. comment count).
   */
  static async getThreadSummaries(): Promise<DiscussionThreadSummary[]> {
    const threads: DiscussionThread[] = await DiscussionThread.getThreadsPopulated();

    let threadSummaries: DiscussionThreadSummary[] = threads.map((thread) => {
      return new DiscussionThreadSummary(thread);
    });

    return threadSummaries;
  }

  static async getReplyTreeForThread(discussionId: number): Promise<DiscussionTreeNode> {
    const posts: DiscussionPost[] = await DiscussionPost.getPathOrderedPostsInThread(discussionId);

    // Create reply tree
    let nodes: { [postId: number]: DiscussionTreeNode } = {};
    let rootPostId: number;

    for (let i = 0; i < posts.length; ++i) {
      let treeNode = await DiscussionTreeNode.makeInstance(posts[i]);
      nodes[treeNode.getDataValue('postId')] = treeNode;

      let parentPostId: number = treeNode.getDataValue('parentPostId');
      if (parentPostId !== null) {
        let parentNode = nodes[parentPostId];
        parentNode.addReply(treeNode);
      } else if (treeNode.getDataValue('isRootPost')) {
        // Assuming no bugs in the post/threads creation logic there should only be one of these
        rootPostId = treeNode.getDataValue('postId');
      }
    }

    return nodes[rootPostId];
  }
}
