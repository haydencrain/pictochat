import React from 'react';
import { Segment, Loader } from 'semantic-ui-react';
import { useFetchReports } from '../../hooks/ReportHooks';
import ReportPosts from './ReportPosts';

/**
 * A React component which fetches the reported posts, and displays them in an administrative dashboard
 * @component
 */
function ReportsDashboard(props: {}) {
  /* HOOKS */
  const { reports, isLoading, unflagReport, deleteReport } = useFetchReports();

  /* HANDLERS */
  const handleUnflagClick = (postId: string) => {
    unflagReport(postId);
  };

  const handleDeleteClick = (postId: string) => {
    deleteReport(postId);
  };

  /* RENDERING */
  const getContent = () => {
    if (isLoading) return <Loader active />;
    if (!reports.length) return <div className="bold">No reports found</div>;
    return <ReportPosts reports={reports} onUnflagClick={handleUnflagClick} onDeleteClick={handleDeleteClick} />;
  };

  return (
    <Segment raised className="reports-dashboard">
      {getContent()}
    </Segment>
  );
}

export default ReportsDashboard;
