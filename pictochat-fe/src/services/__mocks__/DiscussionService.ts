import MOCK_TEST_POSTS from './TestPosts';
import { PAGINATION_LIMIT } from './Constants';
import { SortValue } from '../../models/SortTypes';
import PaginationResult from '../../models/PaginationResult';
import { IDiscussionPost } from '../../models/store/DiscussionPost';
import NewPostPayload from '../../models/NewPostPayload';

const DiscussionService: any = jest.genMockFromModule('../DiscussionService');

DiscussionService.getPost = jest.fn(async (postId, sortType, paginationLimit_, after) => {
  // paginationLimit_ is ignored (only there to implement interface expected by ActiveDiscussionStore)
  let paginationLimit = PAGINATION_LIMIT;
  if (!MOCK_TEST_POSTS.hasOwnProperty(postId)) throw new Error(`Post ${postId} doesn't exist`);

  let post = Object.assign({}, MOCK_TEST_POSTS[postId]);

  // Simulate reply pagination
  let pageStartIdx = after !== null && after !== undefined ? findReplyIndex(post, after) + 1 : 0;
  post.replies = post.replies.slice(pageStartIdx, pageStartIdx + paginationLimit);
  return post;
});

DiscussionService.getDiscussions = jest.fn(
  async (sort: SortValue /* ignored */, limit = 10, start?: number): Promise<PaginationResult<IDiscussionPost>> => {
    let rootPosts = [];
    for (let postId in MOCK_TEST_POSTS) {
      rootPosts.push(MOCK_TEST_POSTS[postId]);
    }
    const pagedResult = { start: start, size: rootPosts.length,
                          results: rootPosts,
                          hasNextPage: false, nextStart: undefined };
    return pagedResult;
  });

let nextPostId = 99;
DiscussionService.createPost = jest.fn(
  async (post: NewPostPayload): Promise<IDiscussionPost> => {
    const mockResponse = {
      ...MOCK_TEST_POSTS['1'],
      ...{
        parentPostId: post.parentPostId,
        discussionId: post.discussionId,
        postId: (++nextPostId).toString()
      }
    };
    return mockResponse;
  });

function findReplyIndex(post, postId) {
  return post.replies.findIndex(post => post.postId.toString() === postId.toString());
}

export default DiscussionService;
