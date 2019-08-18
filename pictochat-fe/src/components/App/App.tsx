import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Navbar from '../common/Navbar';
import HomePage from '../pages/Home';
import NotFoundPage from '../pages/NotFound';
import DiscussionPage from '../pages/Discussion';
import LeaderboardPage from '../pages/Leaderboard';
import RegisterPage from '../pages/Register';
import DiscussionThreadsPage from '../pages/DiscussionThreads';
import './App.less';

export default () => (
  <BrowserRouter>
    <Navbar />
    <main id="main-content">
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/discussion" component={DiscussionPage} />
        <Route exact path="/leaderboard" component={LeaderboardPage} />
        <Route exact path="/register" component={RegisterPage} />
        <Route exact path="/threads" component={DiscussionThreadsPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </main>
  </BrowserRouter>
);
