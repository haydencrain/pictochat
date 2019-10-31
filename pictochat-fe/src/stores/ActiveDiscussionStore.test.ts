import ActiveDiscussionStore from './ActiveDiscussionStore';
import DiscussionStore from './DiscussionStore';

const { PAGINATION_LIMIT } = jest.requireActual('../services/__mocks__/Constants');
import MOCK_TEST_POSTS from '../services/__mocks__/TestPosts';

jest.mock('../services/DiscussionService');
import DiscussionService from '../services/DiscussionService';

/* HELPERS */

function makeActiveDiscussionService() {
  const mockDiscussionStore = { updateCommentCount: (reply: any) => {} };
  return new ActiveDiscussionStore(mockDiscussionStore as DiscussionStore);
}

function mockGetPostWithException() {
  DiscussionService.getPost.mockRejectedValueOnce(new Error('something went wrong'));
}

function matchFirstNReplies(actualRootPost, expectedRootPost, n) {
  expect(actualRootPost.replies.length).toEqual(n);
  for (let i = 0; i < n; ++i) {
    const expectedReply = expectedRootPost.replies[i];
    const actualReply = actualRootPost.replies[i].toJSON();
    expect(actualReply).toMatchObject(expectedReply);
  }
}

function expectUnsetLoadingFlags(store) {
  expect(store.isLoadingReplies).toEqual(false);
  expect(store.isLoadingRoot).toEqual(false);
}

/* TESTS */

let store: ActiveDiscussionStore;
beforeEach(() => {
  store = makeActiveDiscussionService();
  // mockDiscussionServiceModule(MOCK_TEST_POSTS);
});

describe('setDiscussion', () => {
  // NOTE: The obserable properties of stores contain state that React components bind to
  //  so we need to treat observable properties as part of the store's public interface
  //  and test that those properties are set correctly when methods are called
  test('setDiscussion adds root post to post map, sets store.postId and store.discussion, and unsets loading flags', async () => {
    const rootPostId = '1';
    await store.setDiscussion(rootPostId);
    const expectedPost = MOCK_TEST_POSTS[rootPostId];
    const actualPost = store.discussion;

    // Check the three ways components access info about the active discussion
    expect(actualPost.toJSON()).toMatchObject(expectedPost);
    expect(store.postsMap.get(rootPostId)).toMatchObject(expectedPost);
    expect(store.postId).toEqual(rootPostId);

    expectUnsetLoadingFlags(store);
  });

  test("setDiscussion re throws exception if postId doesn't exist", async () => {
    await expect(store.setDiscussion('999999999999999')).rejects;
  });

  test('setDiscussion rethrows exceptions and unsets loading flags when an exception is thrown', async () => {
    mockGetPostWithException();
    try {
      await expect(store.setDiscussion('1')).rejects;
    } catch {
      expectUnsetLoadingFlags(store);
    }
  });
});

describe('getExtraReplies', () => {
  test('getExtraReplies adds correct replies to parent', async () => {
    const rootPostId = '2';
    const mockExpectedRootPost = MOCK_TEST_POSTS[rootPostId];

    // Make DiscussionService.getPost return root with no replies first call
    const initialRootPostState = Object.assign({}, mockExpectedRootPost);
    initialRootPostState.replies = [];
    DiscussionService.getPost.mockReturnValueOnce(initialRootPostState);

    await store.setDiscussion(rootPostId);
    const actualRootPost = store.postsMap.get(rootPostId);
    // Make sure our DiscussionService.getPost mock is working correctly
    expect(actualRootPost.replies.length).toEqual(0);

    // Root should only have the first PAGINATION_LIMIT replies
    await store.getExtraReplies(rootPostId);
    matchFirstNReplies(actualRootPost, mockExpectedRootPost, PAGINATION_LIMIT);

    expectUnsetLoadingFlags(store);

    // Get last reply
    const after: string = actualRootPost.replies[actualRootPost.replies.length - 1].postId;
    const numExpectedReplies = Math.min(PAGINATION_LIMIT * 2, mockExpectedRootPost.replies.length);
    await store.getExtraReplies(rootPostId, after);
    matchFirstNReplies(actualRootPost, mockExpectedRootPost, numExpectedReplies);

    expectUnsetLoadingFlags(store);
  });

  test('getExtraReplies can handle posts with no replies', async () => {
    const rootPostId = '1';
    await store.setDiscussion(rootPostId);
    await expect(store.getExtraReplies(rootPostId)).resolves;
  });

  test('getExtraReplies rethrows exceptions', async () => {
    await store.setDiscussion('2');
    mockGetPostWithException();
    return expect(store.getExtraReplies('2')).rejects.toThrow();
  });

  test('unsets loading flags when exception occurs', async () => {
    try {
      mockGetPostWithException();
      await store.getExtraReplies('2');
    } catch (error) {
      expectUnsetLoadingFlags(store);
    }
  });
});
