import fs from 'fs';
import path from 'path';
import { timestamp } from './date-utils';
import { DiscussionPost } from '../models/discussion-post';
import { DiscussionThread } from '../models/discussion-thread';
import { Image } from '../models/image';
import { syncModels } from './sync-models';

/**
 * Promise-returning wrapper for fs.readFile
 */
function readFile(path: fs.PathLike): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (error, data: Buffer) => {
      if (error) { return reject(error); }
      resolve(data);
    });
  });
}

/**
 * FIXME: Not sure if this is the best way to load test data.
 * May be better to write SQL scripts for schema creation to be run
 * when starting the db for the first time in prod.
 * And then we could use extra scripts for inserting test data which are
 * only run when the db is started in dev environment. - Jordan Finch
 */
export async function loadTestData() {
  await syncModels();

  console.log('Creating test instances for DiscussionPosts');
  let samplePosts = [
    {
      postId: 1,
      discussionId: 1,
      isRootPost: true,
      imageId: '1',
      authorId: 1,
      postedDate: new Date(),
      commentTreePath: '1'
    },
    {
      postId: 11,
      discussionId: 1,
      parentPostId: 1,
      isRootPost: false,
      imageId: '1',
      authorId: 1,
      postedDate: new Date(),
      commentTreePath: '1/11'
    },
    {
      postId: 111,
      discussionId: 1,
      parentPostId: 11,
      isRootPost: false,
      imageId: '2',
      authorId: 1,
      postedDate: new Date(),
      commentTreePath: '1/11/111'
    },
    {
      postId: 1111,
      discussionId: 1,
      parentPostId: 111,
      isRootPost: false,
      imageId: '3',
      authorId: 1,
      postedDate: new Date(),
      commentTreePath: '1/11/111/1111'
    },
    {
      postId: 1112,
      discussionId: 1,
      parentPostId: 111,
      isRootPost: false,
      imageId: '5',
      authorId: 1,
      postedDate: new Date(),
      commentTreePath: '1/11/111/1112'
    },
    {
      postId: 1113,
      discussionId: 1,
      parentPostId: 111,
      isRootPost: false,
      imageId: '6',
      authorId: 1,
      postedDate: new Date(),
      commentTreePath: '1/11/111/1113'
    },
    {
      postId: 112,
      discussionId: 1,
      parentPostId: 11,
      isRootPost: false,
      imageId: '7',
      authorId: 1,
      postedDate: new Date(),
      commentTreePath: '1/11/112'
    },
    {
      postId: 113,
      discussionId: 1,
      parentPostId: 11,
      isRootPost: false,
      imageId: '8',
      authorId: 1,
      postedDate: new Date(),
      commentTreePath: '1/11/113'
    },
    {
      postId: 12,
      discussionId: 1,
      parentPostId: 1,
      isRootPost: false,
      imageId: '9',
      authorId: 1,
      postedDate: new Date(),
      commentTreePath: '1/12'
    },
    {
      postId: 13,
      discussionId: 1,
      parentPostId: 1,
      isRootPost: false,
      imageId: '2',
      authorId: 1,
      postedDate: new Date(),
      commentTreePath: '1/13'
    },
    {
      postId: 14,
      discussionId: 1,
      parentPostId: 1,
      isRootPost: false,
      imageId: '3',
      authorId: 1,
      postedDate: new Date(),
      commentTreePath: '1/14'
    },
    {
      postId: 15,
      discussionId: 1,
      parentPostId: 1,
      isRootPost: false,
      imageId: '5',
      authorId: 1,
      postedDate: new Date(),
      commentTreePath: '1/15'
    },
    {
      postId: 2,
      discussionId: 2,
      isRootPost: true,
      imageId: '6',
      authorId: 1,
      postedDate: new Date(),
      commentTreePath: '2'
    },
    {
      postId: 3,
      discussionId: 3,
      isRootPost: true,
      imageId: '7',
      authorId: 1,
      postedDate: new Date(),
      commentTreePath: '3'
    },
    {
      postId: 4,
      discussionId: 4,
      isRootPost: true,
      imageId: '8',
      authorId: 1,
      postedDate: new Date(),
      commentTreePath: '4'
    },
    {
      postId: 5,
      discussionId: 5,
      isRootPost: true,
      imageId: '9',
      authorId: 1,
      postedDate: new Date(),
      commentTreePath: '5'
    }
  ];
  let sampleCreationPromises = samplePosts.map(postData => DiscussionPost.create(postData));
  await Promise.all(sampleCreationPromises);

  console.log('Creating test instances for DiscussionThreads');
  let sampleThreads = [
    { discussionId: 1, rootPostId: 1 },
    { discussionId: 2, rootPostId: 2 },
    { discussionId: 3, rootPostId: 3 },
    { discussionId: 4, rootPostId: 4 },
    { discussionId: 5, rootPostId: 5 }
  ];
  let threadCreationPromises = sampleThreads.map(threadData => DiscussionThread.create(threadData));
  await Promise.all(threadCreationPromises);

  // Path relative to compiled js file's location in build folder
  let testImages: Buffer[] = [
    await readFile(path.join(__dirname, '../../../test-data/green.JPG')),
    await readFile(path.join(__dirname, '../../../test-data/green.JPG'))
  ];

  let imageCreationPromises = testImages.map((data: Buffer, i) => {
    return Image.create({ imageId: `asdsdfsdfd${i}-${timestamp(new Date())}`, encoding: 'jpg', data: data, uploadedDate: new Date() });
  });
  await Promise.all(imageCreationPromises);
}
