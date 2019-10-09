import { IDiscussionPost } from '../models/store/DiscussionPost';
import ApiService from './ApiService';

export class ContentReportService {
  static async getContentReports(): Promise<IDiscussionPost[]> {
    return await ApiService.get('/content-report');
  }

  static async reportPost(postId: string | number): Promise<void> {
    try {
      await ApiService.post(`/post/${postId}/content-report`, {});
      alert('Report Successful');
    } catch (e) {
      if (e.status === 401) {
        alert('You must be logged in to report posts');
      }
    }
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
