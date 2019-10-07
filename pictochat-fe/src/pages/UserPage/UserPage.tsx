import * as React from 'react';
import { observer } from 'mobx-react';
import { useFetchUser } from '../../hooks/UsersHooks';
import { Loader, Segment } from 'semantic-ui-react';
import { RouteComponentProps } from 'react-router';
import ProfileCard from '../../components/ProfileCard';
import './UserPage.less';

interface UserPageMatchParams {
  username: string;
}

interface UserPageProps extends RouteComponentProps<UserPageMatchParams> {}

function UserPage(props: UserPageProps) {
  const [user, isLoading] = useFetchUser(props.match.params.username);

  const getContent = () => {
    if (isLoading) {
      return (
        <Segment>
          <Loader active />
        </Segment>
      );
    }

    return <ProfileCard user={user} isCurrentUser={false} />;
  };

  return (
    <section id="user-page">
      <h1>User{!!user ? ` - ${user.username}` : ''}</h1>
      {getContent()}
    </section>
  );
}

export default observer(UserPage);
