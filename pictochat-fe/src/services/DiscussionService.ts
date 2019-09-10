import { DiscussionPost } from '../models/DiscussionPost';
import ApiService from './ApiService';
import NewPostPayload from '../models/NewPostPayload';

export class DiscussionService {
  static async getDiscussions(): Promise<DiscussionPost[]> {
    return await ApiService.get(`/discussion`);
  }

  static async getPost(postId: string): Promise<DiscussionPost> {
    return await ApiService.get(`/post/${postId}`);
  }

  static async getPostReplies(discussionId: string): Promise<DiscussionPost[]> {
    const discussion = await this.getPost(discussionId);
    return discussion.replies;
  }

  static async createPost(post: NewPostPayload): Promise<void> {
    const isReplyPost: boolean = !!post.parentId;
    // IMPORTANT: Image must be the last field appended to form data or the server will not see the other fields
    const formData = new FormData();
    formData.append('userId', post.userId);
    console.log(post, isReplyPost);
    if (isReplyPost) {
      formData.append('parentId', post.parentId);
    }
    formData.append('image', post.image);

    return ApiService.post('/post', formData, null);
  }
}

export default DiscussionService;
