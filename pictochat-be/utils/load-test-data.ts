import { DiscussionPost } from '../models/discussion-post';
import { DiscussionThread } from '../models/discussion-thread';
import { Users } from '../models/users';
import { syncModels } from './sync-models';

import { DiscussionService } from '../services/discussion-service';

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
    { postId: 1, discussionId: 1, isRootPost: true, imageId: '1', authorId: 1, postedDate: new Date(), replyTreePath: '1' },
    { postId: 11, discussionId: 1, parentPostId: 1, isRootPost: false, imageId: '1', authorId: 1, postedDate: new Date(), replyTreePath: '1/11' },
    { postId: 111, discussionId: 1, parentPostId: 11, isRootPost: false, imageId: '1', authorId: 1, postedDate: new Date(), replyTreePath: '1/11/111'  },
    { postId: 1111, discussionId: 1, parentPostId: 111, isRootPost: false, imageId: '1', authorId: 1, postedDate: new Date(), replyTreePath: '1/11/111/1111' },
    { postId: 1112, discussionId: 1, parentPostId: 111, isRootPost: false, imageId: '1', authorId: 1, postedDate: new Date(), replyTreePath: '1/11/111/1112' },
    { postId: 1113, discussionId: 1, parentPostId: 111, isRootPost: false, imageId: '1', authorId: 1, postedDate: new Date(), replyTreePath: '1/11/111/1113' },
    { postId: 112, discussionId: 1, parentPostId: 11, isRootPost: false, imageId: '1', authorId: 1, postedDate: new Date(), replyTreePath: '1/11/112' },
    { postId: 113, discussionId: 1, parentPostId: 11, isRootPost: false, imageId: '1', authorId: 1, postedDate: new Date(), replyTreePath: '1/11/113' },
    { postId: 12, discussionId: 1, parentPostId: 1, isRootPost: false, imageId: '1', authorId: 1, postedDate: new Date(), replyTreePath: '1/12' },
    { postId: 13, discussionId: 1, parentPostId: 1, isRootPost: false, imageId: '1', authorId: 1, postedDate: new Date(), replyTreePath: '1/13' },
    { postId: 14, discussionId: 1, parentPostId: 1, isRootPost: false, imageId: '1', authorId: 1, postedDate: new Date(), replyTreePath: '1/14' },
    { postId: 15, discussionId: 1, parentPostId: 1, isRootPost: false, imageId: '1', authorId: 1, postedDate: new Date(), replyTreePath: '1/15' },
    { postId: 2, discussionId: 2, isRootPost: true, imageId: '1', authorId: 1, postedDate: new Date(), replyTreePath: '2' },
    { postId: 3, discussionId: 3, isRootPost: true, imageId: '1', authorId: 1, postedDate: new Date(), replyTreePath: '3' },
    { postId: 4, discussionId: 4, isRootPost: true, imageId: '1', authorId: 1, postedDate: new Date(), replyTreePath: '4' },
    { postId: 5, discussionId: 5, isRootPost: true, imageId: '1', authorId: 1, postedDate: new Date(), replyTreePath: '5' }
  ];
  let sampleCreationPromises = samplePosts.map((postData) => DiscussionPost.create(postData));
  await Promise.all(sampleCreationPromises);

  console.log('Creating test instances for DiscussionThreads')
  let sampleThreads = [
    { discussionId: 1, rootPostId: 1 },
    { discussionId: 2, rootPostId: 2 },
    { discussionId: 3, rootPostId: 3 },
    { discussionId: 4, rootPostId: 4 },
    { discussionId: 5, rootPostId: 5 }
  ];
  let threadCreationPromises = sampleThreads.map((threadData) => DiscussionThread.create(threadData));
  await Promise.all(threadCreationPromises);

  console.log('QUERY RESULT:',
      (await DiscussionService.getThreadSummaries())
        .map((thread) => thread.toFlatJSON()));

  console.log('Creating test instances for Users')
  let sampleUsers = [
    {userId: 1, userEmail: 'testOne@test.com',   username: 'rach',   password: 'test'},
    {userId: 2, userEmail: 'testTwo@test.com',   username: 'cat',    password: 'cc'},
    {userId: 3, userEmail: 'testThree@test.com', username: 'dog',    password: 'dd'},
    {userId: 4, userEmail: 'testFour@test.com',  username: 'mouse',  password: 'mm'},
    {userId: 5, userEmail: 'testFive@test.com',  username: 'rabbit', password: 'rr'}
  ];

  let userCreationPromises = sampleUsers.map((userData) => Users.create(userData));
  await Promise.all(userCreationPromises);
}
