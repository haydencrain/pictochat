import util from 'util';
import fs from 'fs';
import express from 'express';
import multer from 'multer';
import passport from 'passport';
import { strategies } from '../middleware/passport-middleware';
import { DiscussionService, NewReply, NewThread, ArchiveType } from '../services/discussion-service';
import { MIMETYPE_TO_ENCODING } from '../utils/encoding-content-types';
import { DiscussionTreeNode } from '../models/discussion-tree-node';
import config from '../utils/config';
import { User } from '../models/user';
import { ForbiddenError } from '../exceptions/forbidden-error';
import * as ErrorUtils from '../exceptions/error-utils';
import { DiscussionPost } from '../models/discussion-post';

const AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR';

// This will temporarily store images in a local staging directory on the API server
const imageStager = multer({ dest: config.IMAGE_STAGING_DIR });

//// ROUTER ////

export const postRouter = express.Router();

/**
 * Get reply tree under post
 */
postRouter.get('/:postId', async (req, res, next) => {
  try {
    let replyTree: DiscussionTreeNode = await DiscussionService.getReplyTreeUnderPost(req.params.postId);
    res.json(replyTree.toJSON());
  } catch (error) {
    next(error);
  }
});

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

// Update a post
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

postRouter.delete(
  '/:postId',
  passport.authenticate(strategies.JWT, { session: false }),
  async (req: any, res, next) => {
    try {
      let requestingUserId: number = req.user.userId;
      let archiveType: ArchiveType = await DiscussionService.archivePost(req.params.postId, requestingUserId);

      if (archiveType === ArchiveType.DELETED) {
        res.status(204); // Successful, no content
        res.end();
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

async function makeNewImageSpec(file): Promise<{ data: Buffer; encoding: string }> {
  let data = await readFile(file.path);
  let encoding = MIMETYPE_TO_ENCODING[file.mimetype];
  return { data, encoding };
}

function assertIsPostAuthor(body: { userId: string }, user: User) {
  if (parseInt(body.userId) !== user.userId) {
    throw new ForbiddenError("Post's userId and/or supplied JWT token is incorrect or are for different users");
  }
}

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
