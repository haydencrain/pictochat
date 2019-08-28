import { DiscussionPost } from '../model/DiscussionPost';
import ApiService from './ApiService';

export class DiscussionService {
  getRootDiscussionPosts(): Promise<DiscussionPost[]> {
    return ApiService.get(`/discussions`);
  }

  getDiscussion(discussionId: string): Promise<DiscussionPost> {
    return ApiService.get(`/discussions/${discussionId}`);
  }
}

export default new DiscussionService();
