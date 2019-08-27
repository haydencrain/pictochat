import * as React from 'react';
import ProfileCard from '../../common/ProfileCard';
import ThreadPostsContainer from '../../common/ThreadPostsContainer';
import './HomePage.less';

interface HomePage {}

export default (props: HomePage) => {
  return (
    <section id="home-page">
      <div className="main">
        <h1>Threads</h1>
        <ThreadPostsContainer />
      </div>
    </section>
  );
};
