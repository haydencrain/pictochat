import { DiscussionPost } from '../models/DiscussionPost';
import ApiService from './ApiService';
import CreatePost from '../models/CreatePost';

export interface NewPostPayload {
  userId: string,
  image: File,
  parentId?: string,
  discussionId?: string
}

export class DiscussionService {
  async getRootDiscussionPosts(): Promise<DiscussionPost[]> {
    return await ApiService.get(`/discussion`);
  }

  async getDiscussion(discussionId: string): Promise<DiscussionPost> {
    return await ApiService.get(`/discussion/${discussionId}`);
  }

  async getDiscussionReplies(discussionId: string): Promise<DiscussionPost[]> {
    const discussion = await this.getDiscussion(discussionId);
    return discussion.replies;
  }

  async createPost(post: NewPostPayload): Promise<void> {
    let isReplyPost: boolean = !!post.parentId;
    if (isReplyPost) this.checkReplyPostValidity(post);
    let path = (!isReplyPost) ? '/discussion' : `/discussion/${post.discussionId}/post`;

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

  private checkReplyPostValidity(post: NewPostPayload) {
    if (!post.parentId || !post.discussionId) {
      throw new Error('post.discussionId must be populated when post.parentId is populated and vice versa');
    }
  }
}

export default new DiscussionService();
