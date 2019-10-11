import * as React from 'react';
import { observer } from 'mobx-react';
import { Loader, Segment } from 'semantic-ui-react';
import { RouteComponentProps } from 'react-router';
import ProfileCard from '../../components/User/ProfileCard';
import { StoresContext } from '../../contexts/StoresContext';
import './UserPage.less';

interface UserPageMatchParams {
  username: string;
}

interface UserPageProps extends RouteComponentProps<UserPageMatchParams> {}

function UserPage(props: UserPageProps) {
  const userStore = React.useContext(StoresContext).user;

  React.useEffect(() => {
    userStore.fetchUser(props.match.params.username);
  }, [props.match.params.username]);

  const getContent = () => {
    if (userStore.isLoading) {
      return (
        <Segment raised>
          <Loader active />
        </Segment>
      );
    }

    const user = userStore.userMap.get(props.match.params.username);
    if (user) {
      return <ProfileCard user={user} isCurrentUser={false} />;
    }

    return <Segment raised>User not found</Segment>;
  };

  return (
    <section id="user-page">
      <h1>User - {props.match.params.username}</h1>
      {getContent()}
    </section>
  );
}

export default observer(UserPage);
