import path from 'path';
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

async function makeNewImageSpec(file): Promise<{ data: Buffer, encoding: string }> {
  let data = await readFile(file.path);
  let encoding = MIMETYPE_TO_ENCODING[file.mimetype];
  return { data, encoding };
}

// This will store images in a local staging directory on the API server
const imageStager = multer({ dest: config.IMAGE_STAGING_DIR });


//// ROUTER ////

export const discussionRouter = express.Router();

discussionRouter.get('/', async (req, res, next) => {
  try {
    let threadSummaries = await DiscussionService.getThreadSummaries();
    let threadSummariesFlat = threadSummaries.map((threadSummary) => threadSummary.toFlatJSON());
    res.json(threadSummariesFlat);
  } catch (error) {
    next(error);
  }
});

/**
 * Endpoint for creating a new dicussion/thread.
 * Content-Type: multi-part form with the following fields (image must be last)
 *     userId: string
 *     image: File
 */
// discussionRouter.post('/', imageStager.single('image'), async (req: any, res, next) => {
//   try {
//     let newImageSpec = await makeNewImageSpec(req.file);
//     let newThreadSpec = { image: newImageSpec, userId: req.body.userId }
//     let thread = await DiscussionService.createThread(newThreadSpec);
//     res.json(thread.toJSON());
//     await deleteFile(req.file.path);
//   } catch (error) {
//     next(error);
//   }
// });


// discussionRouter.get('/:discussionId', async (req, res, next) => {
//   try {
//     let replyTree: DiscussionTreeNode = await DiscussionService.getReplyTreeForThread(req.params.discussionId);
//     res.json(replyTree.toJSON());
//   } catch (error) {
//     next(error);
//   }
// });

/**
 * Get post in discussion
 */
// discussionRouter.get('/post/:postId', async (req, res, next) => {
//   try {
//     let replyTree: DiscussionTreeNode = await DiscussionService.getReplyTreeUnderPost(req.params.postId);
//     res.json(replyTree.toJSON());
//   } catch (error) {
//     next(error);
//   }
// });

/**
 * Endpoint for creating a new post within an existing thread/discussion.
 * Content-Type: multi-part form with the following fields (image must be last)
 *     userId: string
 *     parentPostId: string
 *     discussionId: string
 *     image: File
 */
// discussionRouter.post('/post', imageStager.single('image'), async (req: any, res, next) => {
//   try {
//     let newImageSpec = await makeNewImageSpec(req.file);
//     let newReplySpec = {
//       image: newImageSpec,
//       discussionId: req.params.discussionId,
//       parentPostId: req.body.parentPostId,
//       userId: req.body.userId
//     };
//     let post = await DiscussionService.createReply(newReplySpec);
//     res.json(post.toJSON());
//     await deleteFile(req.file.path);
//   } catch (error) {
//     next(error);
//   }
// });
