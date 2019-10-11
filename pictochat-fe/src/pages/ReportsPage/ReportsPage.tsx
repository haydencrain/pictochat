import * as React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import StoresContext from '../../contexts/StoresContext';
import ReportsDashboard from '../../components/Report/ReportsDashboard';
import Unauthorised from '../../components/Layout/Unauthorised';
import './ReportsPage.less';

/**
 * A React component that renders the Reports Page, and
 * @component
 */
function ReportsPage() {
  /* STORES */
  const authStore = React.useContext(StoresContext).auth;
  const canViewPage = computed(() => authStore.isLoggedIn && authStore.currentUser.hasAdminRole);

  if (!canViewPage.get()) {
    return <Unauthorised />;
  }

  return (
    <section id="reports-page">
      <h1>Reports</h1>
      <p>This page contains a list of posts that have been flagged as offensive by users</p>
      <ReportsDashboard />
    </section>
  );
}

export default observer(ReportsPage);
