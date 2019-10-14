import { DiscussionPost } from '../models/discussion-post';
import { ContentReport } from '../models/content-report';

/** Gets content reports for admin user */
export class ContentReportService {
  /**
   * Returns an array of posts that have been reported
   */
  static async getContentReports(): Promise<DiscussionPost[]> {
    const reportedPosts = await DiscussionPost.getDiscussionPosts({
      where: { hasInappropriateFlag: true, isHidden: false }
    });
    // return reportedPosts.map(post => new ContentReport(post));
    return reportedPosts;
  }
}
