import * as React from 'react';
import { observer } from 'mobx-react';
import { Loader, Segment } from 'semantic-ui-react';
import { RouteComponentProps } from 'react-router';
import ProfileCard from '../../components/User/ProfileCard';
import { StoresContext } from '../../contexts/StoresContext';
import './UserPage.less';

interface UserPageMatchParams {
  /**
   * The username of the user that has been retrieved from route parameters
   */
  username: string;
}

interface UserPageProps extends RouteComponentProps<UserPageMatchParams> {}

/**
 * A React component used to fetch the user specified by the route parameters, and display their profile card.
 * @param { UserPageProps } props - The props of the component
 */
function UserPage(props: UserPageProps) {
  /* STORE */
  const userStore = React.useContext(StoresContext).user;

  React.useEffect(() => {
    userStore.fetchUser(props.match.params.username);
  }, [props.match.params.username]);

  /* RENDERING */
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
