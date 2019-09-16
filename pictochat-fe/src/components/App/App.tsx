import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { observer } from 'mobx-react';
import { StoresContext, initStores } from '../../contexts/StoresContext';
import Navbar from '../Navbar';
import HomePage from '../../pages/HomePage';
import LeaderboardPage from '../../pages/LeaderboardPage';
import DiscussionPage from '../../pages/DiscussionPage';
import RegisterPage from '../../pages/RegisterPage';
import LoginPage from '../../pages/LoginPage';
import NotFoundPage from '../../pages/NotFoundPage';
import ProfileCard from '../ProfileCard';
import './App.less';

function App() {
  const FRONTEND_URL_ROOT = process.env.PICTOCHAT_FRONTEND_URL_ROOT || '/';
  const [stores, setStores] = React.useState(initStores());
  return (
    <StoresContext.Provider value={stores}>
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route exact path={`${FRONTEND_URL_ROOT}register`} component={RegisterPage} />
          <div id="app-body">
            <main id="app-main">
              <Route exact path={FRONTEND_URL_ROOT} component={HomePage} />
              <Route exact path={`${FRONTEND_URL_ROOT}discussion`} component={DiscussionPage} />
              <Route exact path={`${FRONTEND_URL_ROOT}leaderboard`} component={LeaderboardPage} />
              <Route exact path={`${FRONTEND_URL_ROOT}login`} component={LoginPage} />
              <Route component={NotFoundPage} />
            </main>
            <aside id="app-sidebar">
              <h1>My Profile</h1>
              <ProfileCard />
            </aside>
          </div>
        </Switch>
      </BrowserRouter>
    </StoresContext.Provider>
  );
}

export default observer(App);
