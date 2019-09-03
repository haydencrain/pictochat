import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Navbar from '../Navbar';
import HomePage from '../../pages/HomePage';
import NotFoundPage from '../../pages/NotFoundPage';
import DiscussionPageOld from '../../pages/DiscussionPageOld';
import LeaderboardPage from '../../pages/LeaderboardPage';
import RegisterPage from '../../pages/RegisterPage';
import ProfileCard from '../ProfileCard';
import DiscussionPage from '../../pages/DiscussionPage/DiscussionPage';
import ChallengePage from '../../pages/ChallengePage';
import './App.less';

export default function App() {
  const FRONTEND_URL_ROOT = process.env.PICTOCHAT_FRONTEND_URL_ROOT || '/';
  return (
    <BrowserRouter>
      <Navbar />
      <div id="app-body">
        <main id="app-main">
          <Switch>
            <Route exact path={FRONTEND_URL_ROOT} component={HomePage} />
            <Route exact path={`${FRONTEND_URL_ROOT}discussionOld`} component={DiscussionPageOld} />
            <Route exact path={`${FRONTEND_URL_ROOT}discussion`} component={DiscussionPage} />
            <Route exact path={`${FRONTEND_URL_ROOT}leaderboard`} component={LeaderboardPage} />
            <Route exact path={`${FRONTEND_URL_ROOT}register`} component={RegisterPage} />
            <Route exact path={`${FRONTEND_URL_ROOT}challenge`} component={ChallengePage} />
            <Route component={NotFoundPage} />
          </Switch>
        </main>
        <aside id="app-sidebar">
          <h1>My Profile</h1>
          <ProfileCard />
        </aside>
      </div>
    </BrowserRouter>
  );
}
