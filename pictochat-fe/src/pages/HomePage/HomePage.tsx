import * as React from 'react';
import ThreadListContainer from '../../components/ThreadListContainer';
import { useFetchUser } from '../../hooks/ProfileHooks';
import { Loader } from 'semantic-ui-react';
import './HomePage.less';
import ProfileCard from '../../components/ProfileCard';
import Login from '../../components/Login';
import { Divider } from 'semantic-ui-react';

interface HomePage {
  id: string;
}

export default function HomePage(props: HomePage) {
  const { id } = props;
  const [user, isLoading] = useFetchUser('1');

  const renderContent = () => {
    console.log('hit');
    console.log('Is loading: ' + isLoading);
    console.log('User ' + user);
    if (user === undefined) return <Login />;
    else if (isLoading) return <Loader active />;
    else if (user)
      return (
        <aside id="app-sidebar">
          <h1>My Profile</h1>
          <ProfileCard />
        </aside>
      );
  };

  return (
    <section id="home-page">
      {renderContent()}
      <ThreadListContainer
        sectionHeader="Threads"
        noPostsMessage="No posts have been added yet! Be the first to add a post!"
        addPostButtonMessage="Create Post"
      />
    </section>
  );
}
