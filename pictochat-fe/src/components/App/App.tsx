import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { observer } from 'mobx-react';
import StoresContext, { IStoresContext } from '../../contexts/StoresContext';
import DiscussionStore from '../../stores/DiscussionStore';
import Navbar from '../Navbar';
import HomePage from '../../pages/HomePage';
import NotFoundPage from '../../pages/NotFoundPage';
import LeaderboardPage from '../../pages/LeaderboardPage';
import RegisterPage from '../../pages/RegisterPage';
import ProfileCard from '../ProfileCard';
import DiscussionPage from '../../pages/DiscussionPage/DiscussionPage';
import './App.less';


function initStores(): IStoresContext {
  return { discussion: new DiscussionStore() };
}

function App() {
  const FRONTEND_URL_ROOT = process.env.PICTOCHAT_FRONTEND_URL_ROOT || '/';
  const [stores, setStores] = React.useState(initStores());
  return (
    <StoresContext.Provider value={stores}>
      <BrowserRouter>
        <Navbar />
        <div id="app-body">
          <main id="app-main">
            <Switch>
              <Route exact path={FRONTEND_URL_ROOT} component={HomePage} />
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
    </StoresContext.Provider>
  );
}

export default observer(App);
