import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Navbar from '../common/Navbar';
import HomePage from '../pages/Home';
import NotFoundPage from '../pages/NotFound';
import DiscussionPage from '../pages/Discussion';
import LeaderboardPage from '../pages/Leaderboard';
import RegisterPage from '../pages/Register';
import './App.less';

function App() {
  const FRONTEND_URL_ROOT = process.env.PICTOCHAT_FRONTEND_URL_ROOT || '/';
  return (
    <BrowserRouter>
      <Navbar />
      <main id="main-content">
        <Switch>
          <Route exact path={FRONTEND_URL_ROOT} component={HomePage} />
          <Route exact path={FRONTEND_URL_ROOT + "/discussion"} component={DiscussionPage} />
          <Route exact path={FRONTEND_URL_ROOT + "/leaderboard"} component={LeaderboardPage} />
          <Route exact path={FRONTEND_URL_ROOT + "/register"} component={RegisterPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </main>
    </BrowserRouter>
  );
}

export default App;
