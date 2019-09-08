import path from 'path';
import util from 'util';
import fs from 'fs';
import express from 'express';
import multer from 'multer';
import { DiscussionService } from '../services/discussion-service';
import { ImageService } from '../services/image-service';
import { MIMETYPE_TO_ENCODING } from '../utils/encoding-content-types';
import { DiscussionTreeNode } from '../models/discussion-tree-node';
import config from '../utils/config';

// TODO: Move into module in project utils folder (or maybe see if a promise-based library for fs already exists?)
const readFile = util.promisify(fs.readFile);
const deleteFile = util.promisify(fs.unlink);

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

discussionRouter.get('/:discussionId', async (req, res, next) => {
  try {
    let replyTree: DiscussionTreeNode = await DiscussionService.getReplyTreeForThread(req.params.discussionId);
    res.json(replyTree.toJSON());
  } catch (error) {
    next(error);
  }
});

//// POST HANDLERS ////

async function makeNewImageSpec(file): Promise<{ data: Buffer, encoding: string }> {
  let data = await readFile(file.path);
  let encoding = MIMETYPE_TO_ENCODING[file.mimetype];
  return { data, encoding };
}

// This will store images in a local staging directory on the API server
const imageStager = multer({ dest: config.IMAGE_STAGING_DIR });

/**
 * Endpoint for creating a new thread
 *
 * Content-Type: multi-part form with the following fields (in order)
 *     userId: string
 *     image: File
 */
discussionRouter.post('/', imageStager.single('image'), async (req: any, res, next) => {
  try {
    let imageFile = req.file;
    let newImageSpec = await makeNewImageSpec(imageFile);
    let newThreadSpec = { image: newImageSpec, userId: req.body.userId }
    let thread = await DiscussionService.createThread(newThreadSpec);

    res.json(thread.toJSON());

    await deleteFile(imageFile.path);
  } catch (error) {
    next(error);
  }
});
