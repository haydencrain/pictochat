import React from 'react';
import { IDiscussionPost } from '../../models/store/DiscussionPost';
import { Item } from 'semantic-ui-react';
import ReportPost from './ReportPost';

interface ReportPostsProps {
  /**
   * A list of reported posts
   */
  reports: IDiscussionPost[];
  /**
   * A callback function that is executed when an action to delete a post is performed
   * @function
   * @param { string } postId - The id of the 'to be deleted' post
   */
  onDeleteClick: (postId: string) => void;
  /**
   * A callback function that is executed when an action to unflag a post is performed
   * @function
   * @param { string } postId - The id of the 'to be unflagged' post
   */
  onUnflagClick: (postId: string) => void;
}

/**
 * A React component that displays a list of Report Posts
 * @component
 * @param { ReportPostsProps } props - The props of the component
 */
function ReportPosts(props: ReportPostsProps) {
  const reportPosts = props.reports.map(report => (
    <ReportPost
      report={report}
      key={report.postId}
      onUnflagClick={() => props.onUnflagClick(report.postId)}
      onDeleteClick={() => props.onDeleteClick(report.postId)}
    />
  ));
  return <Item.Group divided>{reportPosts}</Item.Group>;
}

export default ReportPosts;
