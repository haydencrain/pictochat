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
import { useFetchCurrentUser } from '../../hooks/UsersHooks';
import ProfileCard from '../ProfileCard';
import { Loader } from 'semantic-ui-react';
import Login from '../Login';
import './App.less';

const FRONTEND_URL_ROOT = process.env.PICTOCHAT_FRONTEND_URL_ROOT || '/';

function App() {
  const [stores, setStores] = React.useState(initStores());
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

const AppBody = observer(function AppBody() {
  return (
    <div id="app-body">
      <main id="app-main">
        <Switch>
          <Route exact path={FRONTEND_URL_ROOT} component={HomePage} />
          <Route exact path={`${FRONTEND_URL_ROOT}discussion`} component={DiscussionPage} />
          <Route exact path={`${FRONTEND_URL_ROOT}leaderboard`} component={LeaderboardPage} />
          <Route exact path={`${FRONTEND_URL_ROOT}login`} component={LoginPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </main>
      <aside id="app-sidebar">
        <UserSection />
      </aside>
    </div>
  );
});

const UserSection = observer(function UserSection() {
  const stores = React.useContext(StoresContext);
  console.log('UserSection$currentUser: ', stores.user.currentUser);
  // const [user, isLoading] = useFetchCurrentUser();
  // const getCard = () => {
  //   if (stores.user.isLoading) return <Loader active />;
  //   if (!stores.user.isLoggedIn) return <Login />;
  //   return <ProfileCard user={stores.user.currentUser} />;
  // };

  let card;
  if (stores.user.isLoading) {
    card = <Loader active />;
  } else if (!stores.user.isLoggedIn) {
    card = <Login />;
  } else {
    card = <ProfileCard user={stores.user.currentUser} />;
  }

  return (
    <div>
      <h1>My Profile</h1>
      {/*getCard()*/ card}
    </div>
  );
});

export default observer(App);
