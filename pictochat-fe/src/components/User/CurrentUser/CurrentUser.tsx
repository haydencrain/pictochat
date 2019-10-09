import * as React from 'react';
import * as mobx from 'mobx';
import StoresContext from '../../../contexts/StoresContext';
import Login from '../Login';
import ProfileCard from '../ProfileCard';
import { Loader } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import './CurrentUser.less';

function CurrentUser() {
  const stores = React.useContext(StoresContext);
  const isLoading = mobx.computed(() => stores.user.isLoading);

  const handleLogout = () => {
    stores.user.logout();
    location.reload();
  };

  const getCard = () => {
    if (stores.user.isLoading) {
      return <Loader active />;
    }

    if (!stores.user.isLoggedIn) {
      return (
        <Login
          isLoading={isLoading.get()}
          onLogin={async () => {
            location.reload();
          }}
        />
      );
    }

    return <ProfileCard user={stores.user.currentUser} isCurrentUser onLogoutClick={handleLogout} />;
  };

  return (
    <section id="current-user-section">
      <h2>My Profile</h2>
      {getCard()}
    </section>
  );
}

export default observer(CurrentUser);
