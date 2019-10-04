import { DiscussionPost, IDiscussionPost } from '../models/DiscussionPost';
import ApiService from './ApiService';
import NewPostPayload from '../models/NewPostPayload';
import ValidationException from '../models/ValidationException';
import PaginationResult from '../models/PaginationResult';

export class DiscussionService {
  static async getDiscussions(limit = 10, start?: number): Promise<PaginationResult<IDiscussionPost>> {
    return await ApiService.get('/discussion', { limit, start });
  }

  // 'after' is the id of the post before the new replies that you want
  static async getPost(postId: string, limit = 10, after?: string): Promise<DiscussionPost> {
    return await ApiService.get(`/post/${postId}`, { limit, after });
  }

  static async getPostReplies(discussionId: string): Promise<DiscussionPost[]> {
    const discussion = await this.getPost(discussionId);
    return discussion.replies.toJS();
  }

  static async createPost(post: NewPostPayload): Promise<IDiscussionPost> {
    const isReplyPost: boolean = !!post.parentPostId;
    // IMPORTANT: Image must be the last field appended to form data or the server will not see the other fields
    const formData = new FormData();
    formData.append('userId', post.userId);
    if (isReplyPost) {
      formData.append('parentPostId', post.parentPostId);
    }
    formData.append('image', post.image);

    let response = await ApiService.post('/post', formData, null);
    // TODO: Have backend return API URL path that can be used retireve newly created post resource
    return await DiscussionService.getPost(response.postId || response.rootPostId);
  }

  static async updatePost(data: { postId: number; image: File }): Promise<IDiscussionPost> {
    try {
      const formData = new FormData();
      // IMPORTANT: Image must be the last field appended to form data or the server will not see the other fields
      formData.append('postId', data.postId.toString());
      formData.append('image', data.image);
      const updatedPost: IDiscussionPost = await ApiService.patch(`/post/${data.postId}`, formData, null);
      return updatedPost;
    } catch (error) {
      if (error.status === 422) {
        throw new ValidationException();
      }
    }
  }

  static async deletePost(postId: number): Promise<IDiscussionPost> {
    return await ApiService.sendDelete(`/post/${postId}`);
  }
}

export default DiscussionService;
