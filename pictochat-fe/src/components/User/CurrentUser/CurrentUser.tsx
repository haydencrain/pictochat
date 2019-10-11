import * as React from 'react';
import * as mobx from 'mobx';
import StoresContext from '../../../contexts/StoresContext';
import LoginForm from '../LoginForm';
import ProfileCard from '../ProfileCard';
import { Loader } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import './CurrentUser.less';

function CurrentUser() {
  const authStore = React.useContext(StoresContext).auth;
  const isLoading = mobx.computed(() => authStore.isLoading);

  const handleLogout = () => {
    authStore.logout();
    location.reload();
  };

  const getCard = () => {
    if (authStore.isLoading) {
      return <Loader active />;
    }

    if (!authStore.isLoggedIn) {
      return (
        <LoginForm
          isLoading={isLoading.get()}
          onLogin={async () => {
            location.reload();
          }}
        />
      );
    }

    return <ProfileCard user={authStore.currentUser} isCurrentUser onLogoutClick={handleLogout} />;
  };

  return (
    <section id="current-user-section">
      <h2>My Profile</h2>
      {getCard()}
    </section>
  );
}

export default observer(CurrentUser);
