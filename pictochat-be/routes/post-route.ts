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

export const postRouter = express.Router();

/**
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

// POST Flag a post for inappropriate content
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

postRouter.delete('/:postId/content-report', async (req, res, next) => {
  try {
    const post: DiscussionPost = await DiscussionService.setInappropriateFlag(parseInt(req.params.postId), false);
    res.json(makeContentReport(post));
  } catch (error) {
    next(error);
  }
});

postRouter.get('/:postId/content-report', async (req, res, next) => {
  try {
    const post: DiscussionPost = await DiscussionService.getPost(parseInt(req.params.postId));
    if (!post.hasInappropriateFlag) throw new NotFoundError();
    res.json(makeContentReport(post));
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

postRouter.patch(
  '/:postId',
  passport.authenticate(strategies.JWT, { session: false }),
  imageStager.single('image'),
  async (req: any, res, next) => {
    try {
      let newImageSpec = await makeNewImageSpec(req.file);
      let post: DiscussionPost = await DiscussionService.updatePost(req.user.userId, req.body.postId, newImageSpec);
      // Return full tree under updated post so that clients only have to deal with one
      // data structure for all methods.
      let postTree = await DiscussionService.getReplyTreeUnderPost(post.postId);
      res.status(200);
      res.json(postTree.toJSON());
    } catch (error) {
      next(error);
    } finally {
      unlink(req.file.path);
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
        res.status(204);
        return res.end();
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

function makeContentReport(post) {
  return { postId: post.postId, hasInappropriateContentFlag: post.hasInappropriateContentFlag };
}

async function makeNewImageSpec(file): Promise<{ data: Buffer; encoding: string }> {
  let data = await readFile(file.path);
  let encoding = MIMETYPE_TO_ENCODING[file.mimetype];
  if (!encoding) {
    throw new UnprocessableError('File type is not allowed!');
  }
  return { data, encoding };
}

// function assertIsPostAuthor(body: { userId: string }, user: User) {
//   if (parseInt(body.userId) !== user.userId) {
//     throw new ForbiddenError("Post's userId and/or supplied JWT token is incorrect or are for different users");
//   }
// }

async function handleNewReplyPOST(req, res, next) {
  try {
    // assertIsPostAuthor(req.body, req.user);
    const newImageSpec = await makeNewImageSpec(req.file);
    const post = await DiscussionService.createReply(req.user.userId, req.body.parentPostId, newImageSpec);
    // let post = await DiscussionService.createReply(req.body.userId, req.body.parentPostId, newImageSpec);
    // Setting Location and using status 201 to match RESTful conventions for POST responses
    // res.set('Location', `${config.API_ROOT}/post/${post.postId}`);
    res.status(201);
    res.json(post.toJSON());
  } finally {
    await unlink(req.file.path);
    // await deleteFile(req.file.path);
  }
}

async function handleNewThreadPOST(req, res, next) {
  try {
    // assertIsPostAuthor(req.body, req.user);
    const newImageSpec = await makeNewImageSpec(req.file);
    // let newThreadSpec = { image: newImageSpec, userId: req.body.userId };
    const thread = await DiscussionService.createThread(req.user.userId, newImageSpec);
    // let thread = await DiscussionService.createThread(req.body.userId, newImageSpec);
    // Setting Location and using status 201 to match RESTful conventions for POST responses
    // res.set('Location', `${config.API_ROOT}/post/${thread.rootPost.postId}`);
    res.status(201);
    res.json(thread.toFlatJSON());
  } finally {
    await unlink(req.file.path);
  }
}
