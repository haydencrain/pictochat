import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Navbar from '../common/Navbar';
import HomePage from '../pages/Home';
import NotFoundPage from '../pages/NotFound';
import DiscussionPage from '../pages/Discussion';
import LeaderboardPage from '../pages/Leaderboard';
import RegisterPage from '../pages/Register';
import './App.less';
import ProfileCard from '../common/ProfileCard';

export default () => (
  <BrowserRouter>
    <Navbar />
    <div id="app-body">
      <main id="app-main">
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/discussion" component={DiscussionPage} />
          <Route exact path="/leaderboard" component={LeaderboardPage} />
          <Route exact path="/register" component={RegisterPage} />
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
