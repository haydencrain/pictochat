import { useState, useEffect } from 'react';
import { IDiscussionPost } from '../models/store/DiscussionPost';
import ContentReportService from '../services/ContentReportService';
import DiscussionService from '../services/DiscussionService';

/**
 * A React Hook that provides functionality for fetching, deleting and unflagging reports
 * @function
 */
export function useFetchReports(): {
  /**
   * The list of reported posts
   */
  reports: IDiscussionPost[];
  /**
   * Whether the hook is currently fetching reports
   */
  isLoading: boolean;
  /**
   * A function which connects to the Content Report Service, and unflags a report
   * @function
   * @param { string } postId - the id of the post to unflag
   */
  unflagReport: (postId: string) => Promise<void>;
  /**
   * A function which connects to the Discussion Service, and deletes a post
   * @function
   * @param { string } postId - the id of the post to delete
   */
  deleteReport: (postId: string) => Promise<void>;
} {
  const [reports, setReports] = useState<IDiscussionPost[]>();
  const [isLoading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    const contentReports = await ContentReportService.getContentReports();
    setReports(contentReports);
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const unflagReport = async (postId: string) => {
    await ContentReportService.unflagReportedPost(postId);
    fetchReports();
  };

  const deleteReport = async (postId: string) => {
    await DiscussionService.deletePost(postId);
    fetchReports();
  };

  return {
    reports,
    isLoading,
    unflagReport,
    deleteReport
  };
}
