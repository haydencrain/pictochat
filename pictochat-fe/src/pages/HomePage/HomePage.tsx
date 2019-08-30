import * as React from 'react';
import ThreadPostsContainer from '../../components/ThreadPostsContainer';
import './HomePage.less';

interface HomePage {}

export default (props: HomePage) => {
  return (
    <section id="home-page">
      <div className="main">
        <ThreadPostsContainer />
      </div>
    </section>
  );
};
