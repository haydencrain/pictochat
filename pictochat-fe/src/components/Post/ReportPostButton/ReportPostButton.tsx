import * as React from 'react';
import { observer } from 'mobx-react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import ContentReportService from '../../../services/ContentReportService';
import './ReportPostButton.less';

interface ReportPostButtonProps extends RouteComponentProps<any> {
  /**
   * the id of the post to report
   */
  postId: string;
}

/**
 * React component (a button) that will report a post on click
 * @param { ReportPostButtonProps } props - The props of the component
 */
function ReportPostButton(props: ReportPostButtonProps) {
  const handleClick = async () => {
    if (confirm('Are you sure you want to report this image for offensive content?')) {
      await ContentReportService.reportPost(props.postId);
    }
  };

  return (
    <button className="link" onClick={handleClick}>
      report
    </button>
  );
}

export default observer(withRouter(ReportPostButton));
