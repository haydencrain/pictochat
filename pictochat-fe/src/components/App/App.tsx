import * as React from 'react';
import * as mobx from 'mobx';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { observer } from 'mobx-react';
import { StoresContext, initStores } from '../../contexts/StoresContext';
import Navbar from '../Navbar';
import HomePage from '../../pages/HomePage';
import LeaderboardPage from '../../pages/LeaderboardPage';
import DiscussionPage from '../../pages/DiscussionPage';
import RegisterPage from '../../pages/RegisterPage';
import NotFoundPage from '../../pages/NotFoundPage';
import { setDeviceIdCookie } from '../../utils/DeviceId';
import SockPuppetsDashboardPage from '../../pages/SockPuppetsDashboardPage';
import UserPage from '../../pages/UserPage';
import CurrentUser from '../CurrentUser';
import QuickLinks from '../Quicklinks';
import './App.less';

const FRONTEND_URL_ROOT = process.env.PICTOCHAT_FRONTEND_URL_ROOT || '/';

function App() {
  const [stores, setStores] = React.useState(initStores());

  mobx.configure({ enforceActions: 'observed' });

  React.useEffect(() => {
    setDeviceIdCookie();
  });

  return (
    <StoresContext.Provider value={stores}>
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route exact path={`${FRONTEND_URL_ROOT}register`} component={RegisterPage} />
          <Route component={AppBody} />
        </Switch>
      </BrowserRouter>
    </StoresContext.Provider>
  );
}

function AppBody() {
  return (
    <div id="app-body">
      <main id="app-main">
        <Switch>
          <Route exact path={FRONTEND_URL_ROOT} component={HomePage} />
          <Route exact path={`${FRONTEND_URL_ROOT}discussion`} component={DiscussionPage} />
          <Route exact path={`${FRONTEND_URL_ROOT}leaderboard`} component={LeaderboardPage} />
          <Route exact path={`${FRONTEND_URL_ROOT}sock-puppets`} component={SockPuppetsDashboardPage} />
          <Route exact path={`${FRONTEND_URL_ROOT}user/:username`} component={UserPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </main>
      <aside id="app-sidebar">
        <QuickLinks />
        <CurrentUser />
      </aside>
    </div>
  );
}

export default observer(App);
