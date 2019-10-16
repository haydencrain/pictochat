import { DiscussionPost } from '../models/discussion-post';
import { User } from '../models/user';
import { DiscussionPostRepo } from '../repositories/discussion-post-repo';
// import { ContentReport } from '../models/content-report';

export class ContentReportService {
  static async getReportedPosts(): Promise<DiscussionPost[]> {
    const reportedPosts = await DiscussionPostRepo.getFlaggedPosts();
    return reportedPosts;
  }
}
