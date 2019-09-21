import uuid from 'uuid/v4';
import { DiscussionPost } from '../models/discussion-post';
import { DiscussionThread } from '../models/discussion-thread';
import { DiscussionTreeNode } from '../models/discussion-tree-node';
import { NewImage, ImageService } from '../services/image-service';
import { SequelizeConnectionService } from './sequelize-connection-service';
import { Transaction } from 'sequelize/types';
import { Image } from '../models/image';

// HELPER INTERFACES

export interface NewThread {
  userId: number;
  image: NewImage;
}

export interface NewReply {
  userId: number;
  parentPostId: number;
  image: NewImage;
}

// SERVICE

export class DiscussionService {
  /**
   * Creates and persists a new thread
   * @param NewThread Object of structure {image, userId}, where userId is the id for the root post's author
   * @returns DiscussionThread instance created with the specified newThread data */
  static async createThread(newThread: NewThread): Promise<DiscussionThread> {
    let sequelize = SequelizeConnectionService.getInstance();
    // FIXME: Move transaction management into model/data-access layer
    let transaction: Transaction;
    try {
      transaction = await sequelize.transaction();

      let image: Image = await ImageService.saveImage(newThread.image, transaction);
      let discussionId: string = uuid();
      let rootPost: DiscussionPost = await DiscussionPost.create(
        {
          isRootPost: true,
          imageId: image.imageId,
          authorId: newThread.userId,
          postedDate: new Date(),
          discussionId: discussionId
        },
        { transaction }
      );
      await transaction.commit();
      return new DiscussionThread({ discussionId, rootPost, replyCount: 0 });;
    } catch (error) {
      if (transaction !== undefined) {
        transaction.rollback();
      }
      throw error;
    }
  }

  /**
   * Creates and persists a new reply to an existing post
   * @param NewThread Object of structure {image, userId, parentPostId}, where userId is the id for the root post's author
   * @returns DiscussionPost instance created with the specified newPost data */
  static async createReply(newPost: NewReply) {
    let sequelize = SequelizeConnectionService.getInstance();
    let transaction: Transaction;
    try {
      transaction = await sequelize.transaction();
      let image: Image = await ImageService.saveImage(newPost.image, transaction);
      let parentPost: DiscussionPost = await DiscussionPost.findOne({
        transaction,
        where: { postId: newPost.parentPostId }
      });

      let parentReplyPath: string = parentPost.getDataValue('replyTreePath') || '';
      let reply: DiscussionPost = await DiscussionPost.create(
        {
          discussionId: parentPost.getDataValue('discussionId'),
          imageId: image.getDataValue('imageId'),
          authorId: newPost.userId,
          postedDate: new Date(),
          parentPostId: parentPost.getDataValue('postId'),
          replyTreePath: `${parentReplyPath}${parentPost.getDataValue('postId')}/`
        },
        { transaction }
      );

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
   *  and agggregate metrics (e.g. comment count). */
  static async getThreadSummaries(): Promise<DiscussionThread[]> {
    return await DiscussionThread.getDiscussionThreads();
  }

  static async getReplyTreeUnderPost(postId: number): Promise<DiscussionTreeNode> {
    const posts: DiscussionPost[] = await DiscussionPost.getPathOrderedSubTreeUnder(postId);
    return await DiscussionService.makeReplyTree(posts);
  }

  /**
   * @param posts Array of posts ordered by replyTreePath such that the root is the first post
   * @returns Nested tree-like representation of the specified posts array */
  private static async makeReplyTree(posts: DiscussionPost[]): Promise<DiscussionTreeNode> {
    // Create reply tree
    let nodes: { [postId: number]: DiscussionTreeNode } = {};
    let rootPostId: number = posts[0].getDataValue('postId');

    for (let post of posts) {
      let treeNode = await DiscussionTreeNode.makeInstance(post);
      nodes[treeNode.getDataValue('postId')] = treeNode;

      const parentPostId: number = treeNode.getDataValue('parentPostId');
      if (parentPostId !== null) {
        const parentNode = nodes[parentPostId];
        if (!!parentNode) {
          parentNode.addReply(treeNode);
        }
      }
    }

    return nodes[rootPostId];
  }
}
