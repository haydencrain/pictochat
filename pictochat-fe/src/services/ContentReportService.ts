import { IDiscussionPost, DiscussionPost } from '../models/DiscussionPost';
import ApiService from './ApiService';

export class ContentReportService {
  static async getContentReports(): Promise<IDiscussionPost[]> {
    return await ApiService.get('/content-report');
  }

  static async reportPost(
    postId: string | number
  ): Promise<{
    postId: any;
    hasInappropriateContentFlag: any;
  }> {
    return await ApiService.post(`/post/${postId}/content-report`, {});
  }

  static async unflagReportedPost(
    postId: string
  ): Promise<{
    postId: any;
    hasInappropriateContentFlag: any;
  }> {
    return await ApiService.sendDelete(`/post/${postId}/content-report`);
  }
}

export default ContentReportService;
