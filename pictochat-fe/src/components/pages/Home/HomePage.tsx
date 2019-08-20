import * as React from 'react';
import ProfileCard from '../../common/ProfileCard';
import { DiscussionThreads } from '../../common/DiscussionThreads/DiscussionThreads';
import './HomePage.less';

interface HomePage {}

export default (props: HomePage) => {
  return (
    <section id="home-page">
      <div className="main">
        <h1>Threads</h1>
        <DiscussionThreads />
      </div>
      <div className="sidebar">
        <h1>My Profile</h1>
        <ProfileCard />
      </div>
    </section>
  );
};
