import util from 'util';
import fs from 'fs';
import express from 'express';
import multer from 'multer';
import passport from 'passport';
import config from '../utils/config';
import { strategies } from '../middleware/passport-middleware';
import { DiscussionService, ArchiveType } from '../services/discussion-service';
import { MIMETYPE_TO_ENCODING } from '../utils/encoding-content-types';
import { DiscussionTreeNode } from '../models/discussion-tree-node';
import { User } from '../models/user';
import { ForbiddenError } from '../exceptions/forbidden-error';
import { DiscussionPost } from '../models/discussion-post';
import { NotFoundError } from '../exceptions/not-found-error';
import { SequelizeConnectionService } from '../services/sequelize-connection-service';
import { PaginationOptions } from '../utils/pagination-types';
import { UnprocessableError } from '../exceptions/unprocessable-error';

const AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR';

// This will temporarily store images in a local staging directory on the API server
const imageStager = multer({ dest: config.IMAGE_STAGING_DIR });

//// ROUTER ////

export const postRouter = express.Router();
/**
 * Implements HTTP responses for the endpoint `'/post'`
 */

/**
 * Returns a HTTP response for the endpoint `'/post/:postId'`
 * Get reply tree under post
 */
postRouter.get('/:postId', async (req, res, next) => {
  try {
    const { sort, limit, after } = req.query;
    const paginationOptions = new PaginationOptions(after, limit);
    let replyTree: DiscussionTreeNode = await DiscussionService.getReplyTreeUnderPost(
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
 * Returns a HTTP response for the endpoint `'/post/:postId/content-report'`
 * POST Flag a post for inappropriate content
 */
postRouter.post(
  '/:postId/content-report',
  passport.authenticate(strategies.JWT, { session: false }),
  async (req, res, next) => {
    try {
      const post: DiscussionPost = await setPostInappropraiteContentFlag(parseInt(req.params.postId), true);
      res.json(makeContentReport(post));
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Returns a HTTP response for the endpoint `'/post/:postId/content-report'`
 * DELETE flag on post for inappropriate content
 */
postRouter.delete('/:postId/content-report', async (req, res, next) => {
  try {
    const post: DiscussionPost = await setPostInappropraiteContentFlag(parseInt(req.params.postId), false);
    res.json(makeContentReport(post));
  } catch (error) {
    next(error);
  }
});

/**
 * Returns a HTTP response for the endpoint `'/post/:postId/content-report'`
 * GET Flag on a post for inappropriate content
 */
postRouter.get('/:postId/content-report', async (req, res, next) => {
  try {
    console.log(req.params);
    const post: DiscussionPost = await DiscussionService.getPost(parseInt(req.params.postId));
    if (!post.hasInappropriateFlag) throw new NotFoundError();
    res.json(makeContentReport(post));
  } catch (error) {
    next(error);
  }
});

/**
 * Returns a HTTP response for the endpoint `'/post'`
 * POST a post by a logged in user
 */
postRouter.post(
  '/',
  /**Checks that the user is logged in prior to posting */
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
 * Returns a HTTP response for the endpoint `'/post/:postId'`
 * PATCH the post tree to add a new post
 */
postRouter.patch(
  '/:postId',
  passport.authenticate(strategies.JWT, { session: false }),
  imageStager.single('image'),
  async (req: any, res, next) => {
    try {
      let newImageSpec = await makeNewImageSpec(req.file);
      let postUpdateSpec = {
        image: newImageSpec,
        postId: req.body.postId,
        userId: req.user.userId
      };
      let post: DiscussionPost = await DiscussionService.updatePost(postUpdateSpec);
      // Return full tree under updated post so that clients only have to deal with one
      // data structure for all methods.
      let postTree = await DiscussionService.getReplyTreeUnderPost(post.postId);
      res.status(200);
      res.json(postTree.toJSON());
    } catch (error) {
      next(error);
    } finally {
      deleteFile(req.file.path);
    }
  }
);
/**
 * Returns a HTTP response for the endpoint `'post/:postId'`
 * DELETE a post
 */
postRouter.delete(
  '/:postId',
  passport.authenticate(strategies.JWT, { session: false }),
  async (req: any, res, next) => {
    try {
      let requestingUserId: number = req.user.userId;
      let archiveType: ArchiveType = await DiscussionService.archivePost(req.params.postId, requestingUserId);

      if (archiveType === ArchiveType.DELETED) {
        res.status(204); // Successful, no content
        res.send(null);
        return;
      }

      // If Post was hidden
      let post: DiscussionTreeNode = await DiscussionService.getReplyTreeUnderPost(req.params.postId);
      res.status(200);
      res.json(post.toJSON());
    } catch (error) {
      next(error);
    }
  }
);

//// HELPER FUNCTIONS ////

// TODO: Move into module in project utils folder (or maybe see if a promise-based library for fs already exists?)
const readFile = util.promisify(fs.readFile);
const deleteFile = util.promisify(fs.unlink);

// TODO: Put in a a service (not sure which one)
async function setPostInappropraiteContentFlag(postId: number, flagValue: boolean): Promise<DiscussionPost> {
  const sequelize = SequelizeConnectionService.getInstance();
  return await sequelize.transaction(async transaction => {
    const post = await DiscussionService.getPost(postId);
    post.setInappropriateContentFlag(flagValue);
    await post.save();
    return post;
  });
}

function makeContentReport(post) {
  return { postId: post.postId, hasInappropriateContentFlag: post.hasInappropriateContentFlag };
}

/**
 * Encodes image of a correct filetype to blob for database
 * @param file
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
 * Checks that the user is the same as the post's author
 * @param body
 * @param user
 */
function assertIsPostAuthor(body: { userId: string }, user: User) {
  if (parseInt(body.userId) !== user.userId) {
    throw new ForbiddenError("Post's userId and/or supplied JWT token is incorrect or are for different users");
  }
}
/**
 * Creates a reply to a post
 * @param req
 * @param res
 * @param next
 */
async function handleNewReplyPOST(req, res, next) {
  try {
    assertIsPostAuthor(req.body, req.user);
    let newImageSpec = await makeNewImageSpec(req.file);
    let newReplySpec = {
      image: newImageSpec,
      parentPostId: req.body.parentPostId,
      userId: req.body.userId
    };
    let post = await DiscussionService.createReply(newReplySpec);
    // Setting Location and using status 201 to match RESTful conventions for POST responses
    res.set('Location', `${config.API_ROOT}/post/${post.postId}`);
    res.status(201);
    res.json(post.toJSON());
  } finally {
    await deleteFile(req.file.path);
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
    assertIsPostAuthor(req.body, req.user);
    let newImageSpec = await makeNewImageSpec(req.file);
    let newThreadSpec = { image: newImageSpec, userId: req.body.userId };
    let thread = await DiscussionService.createThread(newThreadSpec);
    // Setting Location and using status 201 to match RESTful conventions for POST responses
    res.set('Location', `${config.API_ROOT}/post/${thread.rootPost.postId}`);
    res.status(201);
    res.json(thread.toFlatJSON());
  } finally {
    await deleteFile(req.file.path);
  }
}
