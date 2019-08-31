import { DiscussionPost } from '../models/discussion-post';
import { DiscussionThread } from '../models/discussion-thread';
import { syncModels } from './sync-models';

import { DiscussionThreadService } from '../services/discussion-threads-service';

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
    { postId: 1, discussionId: 1, isRootPost: true, imageId: 1, authorId: 1, postedDate: new Date() },
    { postId: 11, discussionId: 1, parentPostId: 1, isRootPost: false, imageId: 1, authorId: 1, postedDate: new Date() },
    { postId: 111, discussionId: 1, parentPostId: 11, isRootPost: false, imageId: 1, authorId: 1, postedDate: new Date() },
    { postId: 1111, discussionId: 1, parentPostId: 111, isRootPost: false, imageId: 1, authorId: 1, postedDate: new Date() },
    { postId: 1112, discussionId: 1, parentPostId: 111, isRootPost: false, imageId: 1, authorId: 1, postedDate: new Date() },
    { postId: 1113, discussionId: 1, parentPostId: 111, isRootPost: false, imageId: 1, authorId: 1, postedDate: new Date() },
    { postId: 112, discussionId: 11, parentPostId: 111, isRootPost: false, imageId: 1, authorId: 1, postedDate: new Date() },
    { postId: 113, discussionId: 11, parentPostId: 111, isRootPost: false, imageId: 1, authorId: 1, postedDate: new Date() },
    { postId: 12, discussionId: 11, parentPostId: 1, isRootPost: false, imageId: 1, authorId: 1, postedDate: new Date() },
    { postId: 13, discussionId: 11, parentPostId: 1, isRootPost: false, imageId: 1, authorId: 1, postedDate: new Date() },
    { postId: 14, discussionId: 11, parentPostId: 1, isRootPost: false, imageId: 1, authorId: 1, postedDate: new Date() },
    { postId: 15, discussionId: 11, parentPostId: 1, isRootPost: false, imageId: 1, authorId: 1, postedDate: new Date() },
    { postId: 2, discussionId: 2, isRootPost: true, imageId: 1, authorId: 1, postedDate: new Date() },
    { postId: 3, discussionId: 3, isRootPost: true, imageId: 1, authorId: 1, postedDate: new Date() },
    { postId: 4, discussionId: 4, isRootPost: true, imageId: 1, authorId: 1, postedDate: new Date() },
    { postId: 5, discussionId: 5, isRootPost: true, imageId: 1, authorId: 1, postedDate: new Date() }
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
      (await DiscussionThreadService.getThreadSummaries())
        .map((thread) => thread.toFlatJSON()));
}
