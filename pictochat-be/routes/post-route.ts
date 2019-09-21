import util from 'util';
import fs from 'fs';
import express from 'express';
import multer from 'multer';
import { DiscussionService } from '../services/discussion-service';
import { MIMETYPE_TO_ENCODING } from '../utils/encoding-content-types';
import { DiscussionTreeNode } from '../models/discussion-tree-node';
import config from '../utils/config';

//// HELPER FUNCTIONS ////

// TODO: Move into module in project utils folder (or maybe see if a promise-based library for fs already exists?)
const readFile = util.promisify(fs.readFile);
const deleteFile = util.promisify(fs.unlink);

async function makeNewImageSpec(file): Promise<{ data: Buffer; encoding: string }> {
  let data = await readFile(file.path);
  let encoding = MIMETYPE_TO_ENCODING[file.mimetype];
  return { data, encoding };
}

async function handleNewReplyPOST(req, res, next) {
  let newImageSpec = await makeNewImageSpec(req.file);
  let newReplySpec = {
    image: newImageSpec,
    parentPostId: req.body.parentPostId,
    userId: req.body.userId
  };
  let post = await DiscussionService.createReply(newReplySpec);
  res.json(post.toJSON());
  await deleteFile(req.file.path);
}

async function handleNewThreadPOST(req, res, next) {
  let newImageSpec = await makeNewImageSpec(req.file);
  let newThreadSpec = { image: newImageSpec, userId: req.body.userId };
  let thread = await DiscussionService.createThread(newThreadSpec);
  res.json(thread.toFlatJSON());
  await deleteFile(req.file.path);
}

// This will store images in a local staging directory on the API server
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

postRouter.post('/', imageStager.single('image'), async (req, res, next) => {
  try {
    if (!!req.body.parentPostId) {
      await handleNewReplyPOST(req, res, next);
    } else {
      await handleNewThreadPOST(req, res, next);
    }
  } catch (error) {
    next(error);
  }
});
