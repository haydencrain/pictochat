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

function u(t) {
  for (i = a = c.width = 2e3; i--; x.fillRect(a, 0, i / 3, a))
    x.transform(1, -i / 5e5, (n = 1 + C(t + i) * 4), 1, n / i - 199, 0),
      (x.fillStyle = R(i - a / 2, (b = i / 9 + 99 * C(t)), b, 0.04));
}
