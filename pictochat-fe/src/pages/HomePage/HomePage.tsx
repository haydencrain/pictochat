import * as React from 'react';
import PostsContainer from '../../components/PostsContainer';
import './HomePage.less';

interface HomePage {}

export default function HomePage(props: HomePage) {
  return (
    <section id="home-page">
      <div className="main">
        <PostsContainer />
      </div>
    </section>
  );
}
