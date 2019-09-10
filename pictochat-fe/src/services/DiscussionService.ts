import { DiscussionPost } from '../models/DiscussionPost';
import ApiService from './ApiService';
import NewPostPayload from '../models/NewPostPayload';

export class DiscussionService {
  static async getRootDiscussionPosts(): Promise<DiscussionPost[]> {
    return await ApiService.get(`/discussion`);
  }

  static async getDiscussion(discussionId: string): Promise<DiscussionPost> {
    return await ApiService.get(`/discussion/${discussionId}`);
  }

  static async getDiscussionReplies(discussionId: string): Promise<DiscussionPost[]> {
    const discussion = await this.getDiscussion(discussionId);
    return discussion.replies;
  }

  static async createPost(post: NewPostPayload): Promise<void> {
    let isReplyPost: boolean = !!post.parentId;
    if (isReplyPost) this.checkReplyPostValidity(post);
    let path = !isReplyPost ? '/discussion' : `/discussion/${post.discussionId}/post`;

    // IMPORTANT: Image must be the last field appended to form data or the server will not see the other fields
    let formData = new FormData();
    formData.append('userId', post.userId);
    if (isReplyPost) {
      formData.append('parentPostId', post.parentId);
      formData.append('discussionId', post.discussionId);
    }
    formData.append('image', post.image);
    return ApiService.post(path, formData, null);
  }

  private static checkReplyPostValidity(post: NewPostPayload) {
    if (!post.parentId || !post.discussionId) {
      throw new Error('post.discussionId must be populated when post.parentId is populated and vice versa');
    }
  }
}

export default DiscussionService;
