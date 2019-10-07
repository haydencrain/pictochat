import { IDiscussionPost } from '../models/DiscussionPost';
import ApiService from './ApiService';

export class ContentReportService {
  static async getContentReports(): Promise<IDiscussionPost[]> {
    return await ApiService.get('/content-report');
  }
}

export default ContentReportService;
