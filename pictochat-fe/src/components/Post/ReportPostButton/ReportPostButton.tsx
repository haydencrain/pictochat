import * as React from 'react';
import { observer } from 'mobx-react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import ContentReportService from '../../../services/ContentReportService';
import './ReportPostButton.less';

interface ReportPostButtonProps extends RouteComponentProps<any> {
  postId: string;
}

function ReportPostButton(props: ReportPostButtonProps) {
  // TODO: pass the handle Report method up to a higher component in order to increase modularity
  const handleClick = async () => {
    if (confirm('Are you sure you want to report this image for offensive content?')) {
      const report = await ContentReportService.reportPost(props.postId);
    }
  };

  return (
    <button className="link" onClick={handleClick}>
      report
    </button>
  );
}

export default observer(withRouter(ReportPostButton));
