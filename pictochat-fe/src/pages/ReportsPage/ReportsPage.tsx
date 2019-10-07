import * as React from 'react';
import { Loader, Item, Button, Segment } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import StoresContext from '../../contexts/StoresContext';
import { computed } from 'mobx';
import ContentReportService from '../../services/ContentReportService';
import moment from 'moment-mini';
import { IDiscussionPost } from '../../models/DiscussionPost';
import './ReportsPage.less';

interface PageProps extends RouteComponentProps<any> {}

function ReportsPage(props: PageProps) {
  const stores = React.useContext(StoresContext);
  const canViewPage = computed(() => stores.user.isLoggedIn && stores.user.currentUser.hasAdminRole);

  const [reports, setReports] = React.useState<IDiscussionPost[]>();
  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      const contentReports = await ContentReportService.getContentReports();
      setReports(contentReports);
      setLoading(false);
    })();
  }, []);

  let content;
  if (!canViewPage.get()) {
    content = 'You are unauthorised to view this page';
  } else if (isLoading) {
    content = <Loader active />;
  } else {
    content = <ReportsDashboard reports={reports} />;
  }

  return <section id="reports-page">{content}</section>;
}

export default observer(ReportsPage);

//// INNER COMPONENTS ////

const ReportsDashboard = observer(function ReportsDashboard(props: { reports: IDiscussionPost[] }) {
  const getContent = () => {
    if (props.reports.length > 0) {
      return <ReportAlert reports={props.reports} />;
    }
    return <div className="bold">No reports found</div>;
  };

  return (
    <>
      <h1>Reports</h1>
      <p>This page contains a list of posts that have been flagged as offensive by users</p>
      <Segment raised className="reports-dashboard">
        {getContent()}
      </Segment>
    </>
  );
});

const ReportAlert = observer(function ReportAlert(props: { reports: IDiscussionPost[] }) {
  const reportItems = props.reports.map(report => <ReportPost report={report} key={report.postId} />);
  return <Item.Group divided>{reportItems}</Item.Group>;
});

const ReportPost = observer(function ReportPost(props: { report: IDiscussionPost }) {
  const post = () => props.report;
  const handleDisableUser = async () => {};
  return (
    <Item>
      <Item.Image src={post().imageSrc} />
      <Item.Content>
        <Item.Header>PostId: {post().postId}</Item.Header>
        <Item.Meta>Created At: {moment(post().postedDate).format()}</Item.Meta>
        <Item.Description>User: {post().author.username}</Item.Description>
        <Item.Extra>
          <Button floated="right">Delete Post</Button>
          <Button floated="right">Unflag Post</Button>
        </Item.Extra>
      </Item.Content>
    </Item>
  );
});
