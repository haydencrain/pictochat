import * as React from 'react';
import './HomePage.less';
import ProfileCard from '../../common/ProfileCard';

interface HomePage {}

export default (props: HomePage) => {
  return (
    <section id="home-page">
      <div className="main">
        <h1>Threads</h1>
      </div>
      <div className="sidebar">
        <h1>My Profile</h1>
        <ProfileCard />
      </div>
    </section>
  );
};
