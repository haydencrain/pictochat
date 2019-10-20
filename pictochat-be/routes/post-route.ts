import { unlink, readFile } from 'fs-extra';
import express from 'express';
import multer from 'multer';
import passport from 'passport';
import config from '../utils/config';
import { strategies } from '../middleware/passport-middleware';
import { DiscussionService, ArchiveType } from '../services/discussion-service';
import { MIMETYPE_TO_ENCODING } from '../utils/encoding-content-types';
import { DiscussionTreeNode } from '../models/discussion-tree-node';
import { DiscussionPost } from '../models/discussion-post';
import { NotFoundError } from '../exceptions/not-found-error';
import { PaginationOptions } from '../utils/pagination-types';
import { UnprocessableError } from '../exceptions/unprocessable-error';

// This will temporarily store images in a local staging directory on the API server
const imageStager = multer({ dest: config.IMAGE_STAGING_DIR });

//// ROUTER ////

/**
 * Implements HTTP responses for the endpoint `'/api/post'`
 */
export const postRouter = express.Router();

/**
 * GET discussion tree node for postId
 * @urlParam postId
 *
 * @queryParam sort The sorting strategy to use for replies. Must be a value defined in SortTypes (used for pagination)
 * @queryParam limit Maximum number of replies to include (used for pagination)
 * @queryParam after The lowest postId to include in the post's replies (used for pagination)
 */
postRouter.get('/:postId', async (req, res, next) => {
  try {
    const { sort, limit, after } = req.query;
    const paginationOptions = new PaginationOptions(after, limit);
    const replyTree: DiscussionTreeNode = await DiscussionService.getReplyTreeUnderPost(
      req.params.postId,
      sort,
      paginationOptions
    );
    res.json(replyTree.toJSON());
  } catch (error) {
    next(error);
  }
});

/**
 * POST
 * Flag a post for inappropriate content
 * @urlParam postId
 */
postRouter.post(
  '/:postId/content-report',
  passport.authenticate(strategies.JWT, { session: false }),
  async (req, res, next) => {
    try {
      const post: DiscussionPost = await DiscussionService.setInappropriateFlag(parseInt(req.params.postId), true);
      res.json(makeContentReport(post));
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE flag on post for inappropriate content
 * @urlParam postId
 */
postRouter.delete('/:postId/content-report', async (req, res, next) => {
  try {
    const post: DiscussionPost = await DiscussionService.setInappropriateFlag(parseInt(req.params.postId), false);
    res.json(makeContentReport(post));
  } catch (error) {
    next(error);
  }
});

/**
 * GET Flag on a post for inappropriate content
 * @urlParam postId
 */
postRouter.get('/:postId/content-report', async (req, res, next) => {
  try {
    const post: DiscussionPost = await DiscussionService.getPost(parseInt(req.params.postId));
    if (!post.hasInappropriateFlag) throw new NotFoundError();
    res.json(makeContentReport(post));
  } catch (error) {
    next(error);
  }
});

/**
 * POST a post by a logged in user
 * @body Multi-Part Form with the following fields:
 *    parentPostId: (optional) The post that this posts is directly replying too
 *    image: A File containing the post's image
 */
postRouter.post(
  '/',
  passport.authenticate(strategies.JWT, { session: false }),
  imageStager.single('image'),
  async (req, res, next) => {
    try {
      if (!!req.body.parentPostId) {
        await handleNewReplyPOST(req, res, next);
      } else {
        await handleNewThreadPOST(req, res, next);
      }
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PATCH
 * Update a post's content
 *
 * @urlParam postId
 * @body A Multi-Part Form with the following fields
 *      image: A File containing the new image for the specified postId
 */
postRouter.patch(
  '/:postId',
  passport.authenticate(strategies.JWT, { session: false }),
  imageStager.single('image'),
  async (req: any, res, next) => {
    try {
      const newImageSpec = await makeNewImageSpec(req.file);
      const post: DiscussionPost = await DiscussionService.updatePost(req.user.userId, req.params.postId, newImageSpec);
      // Return full tree under updated post so that clients only have to deal with one
      // data structure for all methods.
      const postTree = await DiscussionService.getReplyTreeUnderPost(post.postId);
      res.json(postTree.toJSON());
    } catch (error) {
      next(error);
    } finally {
      unlink(req.file.path);
    }
  }
);

/**
 * DELETE a post
 * @urlParam postId
 */
postRouter.delete(
  '/:postId',
  passport.authenticate(strategies.JWT, { session: false }),
  async (req: any, res, next) => {
    try {
      const requestingUserId: number = req.user.userId;
      const archiveType: ArchiveType = await DiscussionService.archivePost(req.params.postId, requestingUserId);

      if (archiveType === ArchiveType.DELETED) {
        res.status(204);
        return res.end();
      }

      // If Post was hidden
      const post: DiscussionTreeNode = await DiscussionService.getReplyTreeUnderPost(req.params.postId);
      res.json(post.toJSON());
    } catch (error) {
      next(error);
    }
  }
);

//// HELPER FUNCTIONS ////

function makeContentReport(post: DiscussionPost): { postId: number; hasInappropriateContentFlag: boolean } {
  return { postId: post.postId, hasInappropriateContentFlag: post.hasInappropriateFlag };
}

/**
 * Extracts the correct encoding and content from the specified image
 * @param file A multer File object for the image
 */
async function makeNewImageSpec(file): Promise<{ data: Buffer; encoding: string }> {
  let data = await readFile(file.path);
  let encoding = MIMETYPE_TO_ENCODING[file.mimetype];
  if (!encoding) {
    throw new UnprocessableError('File type is not allowed!');
  }
  return { data, encoding };
}

/**
 * Creates a reply to a post
 * @param req
 * @param res
 * @param next
 */
async function handleNewReplyPOST(req, res, next) {
  try {
    const newImageSpec = await makeNewImageSpec(req.file);
    const post = await DiscussionService.createReply(req.user.userId, req.body.parentPostId, newImageSpec);
    res.status(201);
    res.json(post.toJSON());
  } finally {
    await unlink(req.file.path);
  }
}

/**
 * Establishes a post as the parent of the reply thread
 * @param req
 * @param res
 * @param next
 */
async function handleNewThreadPOST(req, res, next) {
  try {
    const newImageSpec = await makeNewImageSpec(req.file);
    const thread = await DiscussionService.createThread(req.user.userId, newImageSpec);
    res.status(201);
    res.json(thread.toFlatJSON());
  } finally {
    await unlink(req.file.path);
  }
}
