import { DiscussionPost } from '../models/discussion-post';
import { ContentReport } from '../models/content-report';

export class ContentReportService {
  static async getContentReports(): Promise<DiscussionPost[]> {
    const reportedPosts = await DiscussionPost.getDiscussionPosts({ where: { hasInappropriateFlag: true } });
    // return reportedPosts.map(post => new ContentReport(post));
    return reportedPosts;
  }
}
