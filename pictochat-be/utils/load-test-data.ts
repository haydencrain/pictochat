import fs from 'fs';
import path from 'path';
import { timestamp } from './date-utils';
import { DiscussionPost } from '../models/discussion-post';
import { DiscussionThread } from '../models/discussion-thread';
import { Image } from '../models/image';
import { syncModels } from './sync-models';
import { User } from '../models/user';

/**
 * Promise-returning wrapper for fs.readFile
 */
function readFile(path: fs.PathLike): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (error, data: Buffer) => {
      if (error) {
        return reject(error);
      }
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
  // let samplePosts = [];
  // for (let postData of samplePosts) {
  //   await DiscussionPost.create(postData);
  // }

  console.log('Creating test instances for DiscussionThreads');
  // let sampleThreads = [];
  // let threadCreationPromises = sampleThreads.map(threadData => DiscussionThread.create(threadData));
  // await Promise.all(threadCreationPromises);

  // Path relative to compiled js file's location in build folder
  let testImages: Buffer[] = [
    await readFile(path.join(__dirname, '../../../test-data/green.JPG')),
    await readFile(path.join(__dirname, '../../../test-data/green.JPG'))
  ];

  let imageCreationPromises = testImages.map((data: Buffer, i) => {
    return Image.create({
      imageId: `asdsdfsdfd${i}-20190101T010101000`,
      encoding: 'jpg',
      data: data,
      uploadedDate: new Date()
    });
  });
  await Promise.all(imageCreationPromises);

  console.log('Creating test instances for DiscussionThreads');
  // password hash for the password: 'password'
  const hash = '$2b$12$zKBpkyOWQHkbG9beO1alH.zyZlInYEcCwKEF4lByrypFFpBQu9/9a';
  await User.create({
    email: 'test@test.com',
    username: 'Dosss',
    password: hash
  });
}
