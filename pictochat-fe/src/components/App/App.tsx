import * as React from 'react';
import * as mobx from 'mobx';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { observer } from 'mobx-react';
import { StoresContext, initStores } from '../../contexts/StoresContext';
import { setDeviceIdCookie } from '../../utils/DeviceId';
import Navbar from '../Layout/Navbar';
import HomePage from '../../pages/HomePage';
import LeaderboardPage from '../../pages/LeaderboardPage';
import DiscussionPage from '../../pages/DiscussionPage';
import RegisterPage from '../../pages/RegisterPage';
import NotFoundPage from '../../pages/NotFoundPage';
import SockPuppetsPage from '../../pages/SockPuppetsPage';
import ReportsPage from '../../pages/ReportsPage';
import UserPage from '../../pages/UserPage';
import CurrentUser from '../User/CurrentUser';
import QuickLinks from '../Layout/QuickLinks';
import config from '../../config';
import './App.less';

const { FRONTEND_URL_ROOT } = config.urls;

/**
 * This component encapsulates the entire React application.
 * It provides the store context to child components, and handles routing
 * @component
 */
function App() {
  /* Data */
  const [stores] = React.useState(initStores());

  // enforce mobx store actions to be observed
  mobx.configure({ enforceActions: 'observed' });

  React.useEffect(() => {
    setDeviceIdCookie();
  });

  /* Rendereing */

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

/**
 * This component provides the layout for the Application body, including the main content and the sidebar
 * @component
 */
function AppBody() {
  /* Rendering */
  return (
    <div id="app-body">
      <main id="app-main">
        <Switch>
          <Route exact path={FRONTEND_URL_ROOT} component={HomePage} />
          <Route exact path={`${FRONTEND_URL_ROOT}discussion/:id`} component={DiscussionPage} />
          <Route exact path={`${FRONTEND_URL_ROOT}leaderboard`} component={LeaderboardPage} />
          <Route exact path={`${FRONTEND_URL_ROOT}user/:username`} component={UserPage} />
          <Route exact path={`${FRONTEND_URL_ROOT}sock-puppets`} component={SockPuppetsPage} />
          <Route exact path={`${FRONTEND_URL_ROOT}reports`} component={ReportsPage} />
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
