import fs from 'fs';
import path from 'path';
import { DiscussionPost } from '../models/discussion-post';
import { Image } from '../models/image';
import { syncModels } from './sync-models';
import { User } from '../models/user';
import { LoginLog } from '../models/login-log';
import { Reaction } from '../models/reaction';

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

  console.log('Creating test instances for users');
  // password hash for the password: 'password'
  const hash = '$2b$12$zKBpkyOWQHkbG9beO1alH.zyZlInYEcCwKEF4lByrypFFpBQu9/9a';
  await User.create({
    email: 'test@test.com',
    username: 'testuser1', // please avoid using Dosss as that's the name we've been hardcoding for mock data
    password: hash
  });
  await User.create({
    email: 'test2@test.com',
    username: 'testuser2', // please avoid using Dosss as that's the name we've been hardcoding for mock data
    password: hash
  });
  await User.create({
    email: 'test3@test.com',
    username: 'testuser3', // please avoid using Dosss as that's the name we've been hardcoding for mock data
    password: hash
  });

  // Path relative to compiled js file's location in build folder
  let testImages: Buffer[] = [
    await readFile(path.join(__dirname, '../../../test-data/green.JPG')),
    await readFile(path.join(__dirname, '../../../test-data/yellow.JPG'))
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

  console.log('Creating test instances for DiscussionPosts');
  let samplePosts = [
    { //1
      discussionId: '1',
      isRootPost: true,
      imageId: 'asdsdfsdfd1-20190101T010101000',
      authorId: 1,
      postedDate: new Date()
    },
    { //2
      discussionId: '1',
      parentPostId: 1,
      isRootPost: false,
      imageId: 'asdsdfsdfd0-20190101T010101000',
      authorId: 2,
      postedDate: new Date(),
      replyTreePath: '1/'
    },
    { //3
      discussionId: '1',
      parentPostId: 2,
      isRootPost: false,
      imageId: 'asdsdfsdfd1-20190101T010101000',
      authorId: 1,
      postedDate: new Date(),
      replyTreePath: '1/2/',
      hasInappropriateFlag: true
    },
    { //4
      discussionId: '1',
      parentPostId: 3,
      isRootPost: false,
      imageId: 'asdsdfsdfd1-20190101T010101000',
      authorId: 2,
      postedDate: new Date(),
      replyTreePath: '1/2/3/'
    },
    { //5
      discussionId: '1',
      parentPostId: 3,
      isRootPost: false,
      imageId: 'asdsdfsdfd1-20190101T010101000',
      authorId: 2,
      postedDate: new Date(),
      replyTreePath: '1/2/3/',
      hasInappropriateFlag: true
    },
    { //6
      discussionId: 1,
      parentPostId: 3,
      isRootPost: false,
      imageId: 'asdsdfsdfd0-20190101T010101000',
      authorId: 1,
      postedDate: new Date(),
      replyTreePath: '1/2/3/'
    },
    { //7
      discussionId: 1,
      parentPostId: 2,
      isRootPost: false,
      imageId: 'asdsdfsdfd1-20190101T010101000',
      authorId: 1,
      postedDate: new Date(),
      replyTreePath: '1/2/',
      hasInappropriateFlag: true
    },
    { //8
      discussionId: 1,
      parentPostId: 2,
      isRootPost: false,
      imageId: 'asdsdfsdfd0-20190101T010101000',
      authorId: 2,
      postedDate: new Date(),
      replyTreePath: '1/2/'
    },
    { //9
      discussionId: 1,
      parentPostId: 1,
      isRootPost: false,
      imageId: 'asdsdfsdfd1-20190101T010101000',
      authorId: 1,
      postedDate: new Date(),
      replyTreePath: '1/'
    },
    { //10
      discussionId: 1,
      parentPostId: 1,
      isRootPost: false,
      imageId: 'asdsdfsdfd1-20190101T010101000',
      authorId: 1,
      postedDate: new Date(),
      replyTreePath: '1/'
    },
    { //11
      discussionId: 1,
      parentPostId: 1,
      isRootPost: false,
      imageId: 'asdsdfsdfd0-20190101T010101000',
      authorId: 1,
      postedDate: new Date(),
      replyTreePath: '1/'
    },
    { //12
      discussionId: 1,
      parentPostId: 1,
      isRootPost: false,
      imageId: 'asdsdfsdfd1-20190101T010101000',
      authorId: 1,
      postedDate: new Date(),
      replyTreePath: '1/'
    },
    { //13
      discussionId: 2,
      isRootPost: true,
      imageId: 'asdsdfsdfd0-20190101T010101000',
      authorId: 1,
      postedDate: new Date(),
      hasInappropriateFlag: true
    },
    { //14
      discussionId: 3,
      isRootPost: true,
      imageId: 'asdsdfsdfd0-20190101T010101000',
      authorId: 2,
      postedDate: new Date()
    },
    { //15
      discussionId: 4,
      isRootPost: true,
      imageId: 'asdsdfsdfd0-20190101T010101000',
      authorId: 1,
      postedDate: new Date()
    },
    { //16
      parentPostId: 13,
      discussionId: 2,
      isRootPost: false,
      imageId: 'asdsdfsdfd0-20190101T010101000',
      authorId: 1,
      postedDate: new Date(),
      replyTreePath: '13/'
    },
    { //17
      discussionId: 5,
      isRootPost: true,
      imageId: 'asdsdfsdfd0-20190101T010101000',
      authorId: 1,
      postedDate: new Date()
    }
  ];
  for (let postData of samplePosts) {
    await DiscussionPost.create(postData);
  }

  await Reaction.bulkCreate([
    { postId: 15, userId: 1, reactionName: 'laugh' }
  ]);

  await LoginLog.bulkCreate([
    { userId: 1, deviceId: 'device1', loginTimestamp: new Date() },
    { userId: 2, deviceId: 'device1', loginTimestamp: new Date() },
    { userId: 3, deviceId: 'device1', loginTimestamp: new Date() },
    { userId: 3, deviceId: 'device1', loginTimestamp: new Date() }
  ]);
}
