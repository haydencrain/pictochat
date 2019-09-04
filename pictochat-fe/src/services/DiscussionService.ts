import { DiscussionPost } from '../models/DiscussionPost';
import ApiService from './ApiService';

export class DiscussionService {
  async getRootDiscussionPosts(): Promise<DiscussionPost[]> {
    return await ApiService.get(`/discussions`);
  }

  async getDiscussion(discussionId: string): Promise<DiscussionPost> {
    return await ApiService.get(`/discussions/${discussionId}`);
  }

  async getDiscussionReplies(discussionId: string): Promise<DiscussionPost[]> {
    const discussion = await this.getDiscussion(discussionId);
    return discussion.replies;
  }
}

export default new DiscussionService();
