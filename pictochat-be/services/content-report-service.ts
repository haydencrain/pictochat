import { DiscussionPost } from '../models/discussion-post';
import { User } from '../models/user';
import { DiscussionPostRepo } from '../repositories/discussion-post-repo';
// import { ContentReport } from '../models/content-report';

/** Gets content reports for admin user */
export class ContentReportService {
  /**
    * Returns an array of posts that have been reported
    */
  static async getReportedPosts(): Promise<DiscussionPost[]> {
    const reportedPosts = await DiscussionPostRepo.getFlaggedPosts();
    return reportedPosts;
  }
}
