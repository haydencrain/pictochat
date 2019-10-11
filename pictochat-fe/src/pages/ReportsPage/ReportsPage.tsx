import * as React from 'react';
import { Loader, Item, Button, Segment } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import StoresContext from '../../contexts/StoresContext';
import { computed } from 'mobx';
import ContentReportService from '../../services/ContentReportService';
import moment from 'moment-mini';
import { IDiscussionPost } from '../../models/store/DiscussionPost';
import { Link } from 'react-router-dom';
import Unauthorised from '../../components/Layout/Unauthorised';
import DiscussionService from '../../services/DiscussionService';
import './ReportsPage.less';

/**
 * A React component that renders the Reports Page
 */
function ReportsPage(props: {}) {
  const authStore = React.useContext(StoresContext).auth;
  const canViewPage = computed(() => authStore.isLoggedIn && authStore.currentUser.hasAdminRole);
  const [reports, setReports] = React.useState<IDiscussionPost[]>();
  const [isLoading, setLoading] = React.useState(true);

  const fetchReports = async () => {
    setLoading(true);
    const contentReports = await ContentReportService.getContentReports();
    setReports(contentReports);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchReports();
  }, []);

  if (!canViewPage.get()) {
    return <Unauthorised />;
  }

  const unflagReport = async (postId: string) => {
    await ContentReportService.unflagReportedPost(postId);
    fetchReports();
  };

  const deleteReport = async (postId: string) => {
    await DiscussionService.deletePost(postId);
    fetchReports();
  };

  const handleUnflagClick = (postId: string) => {
    unflagReport(postId);
  };

  const handleDeleteClick = (postId: string) => {
    deleteReport(postId);
  };

  const getContent = () => {
    if (isLoading) return <Loader active />;
    if (reports.length > 0) {
      return <ReportPosts reports={reports} onUnflagClick={handleUnflagClick} onDeleteClick={handleDeleteClick} />;
    }
    return <div className="bold">No reports found</div>;
  };

  return (
    <section id="reports-page">
      <h1>Reports</h1>
      <p>This page contains a list of posts that have been flagged as offensive by users</p>
      <Segment raised className="reports-dashboard">
        {getContent()}
      </Segment>
    </section>
  );
}

function ReportPosts(props: {
  reports: IDiscussionPost[];
  onDeleteClick: (postId: string) => void;
  onUnflagClick: (postId: string) => void;
}) {
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

function ReportPost(props: { report: IDiscussionPost; onDeleteClick: () => void; onUnflagClick: () => void }) {
  const post = () => props.report;
  return (
    <Item>
      <Item.Image src={post().imageSrc} />
      <Item.Content>
        <Item.Header>
          PostId: <Link to={`/discussion/${post().postId}`}>{post().postId}</Link>
        </Item.Header>
        <Item.Meta>{moment(post().postedDate).format()}</Item.Meta>
        <Item.Description>User: {post().author.username}</Item.Description>
        <Item.Extra>
          <Button floated="right" onClick={props.onDeleteClick}>
            Delete Post
          </Button>
          <Button floated="right" onClick={props.onUnflagClick}>
            Unflag Post
          </Button>
        </Item.Extra>
      </Item.Content>
    </Item>
  );
}

export default observer(ReportsPage);
