import * as React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import StoresContext from '../../contexts/StoresContext';
import Unauthorised from '../../components/Layout/Unauthorised';
import SockPuppetsDashboard from '../../components/SockPuppet/SockPuppetsDashboard';
import config from '../../config';
import './SockPuppetsPage.less';

const { USER_LIMIT } = config.sockPuppets;

export function SockPuppetsDashboardPage(props: {}) {
  const authStore = React.useContext(StoresContext).auth;
  const canViewPage = computed(() => authStore.isLoggedIn && authStore.currentUser.hasAdminRole);

  if (!canViewPage.get()) {
    return <Unauthorised />;
  }

  return (
    <section id="sock-puppet-dashboard-page">
      <h1>Sock Puppets</h1>
      <p>This page contains a list of devices that have been used to access more than {USER_LIMIT} users/accounts.</p>
      <SockPuppetsDashboard />
    </section>
  );
}

export default observer(SockPuppetsDashboardPage);
