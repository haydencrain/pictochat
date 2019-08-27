import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Navbar from '../common/Navbar';
import HomePage from '../pages/Home';
import NotFoundPage from '../pages/NotFound';
import DiscussionPageOld from '../pages/DiscussionOld';
import LeaderboardPage from '../pages/Leaderboard';
import RegisterPage from '../pages/Register';
import ProfileCard from '../common/ProfileCard';
import DiscussionPage from '../pages/Discussion/DiscussionPage';
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
