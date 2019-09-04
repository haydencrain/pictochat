import * as React from 'react';
import ThreadListContainer from '../../components/ThreadListContainer';
import './HomePage.less';

interface HomePage {}

export default function HomePage(props: HomePage) {
  return (
    <section id="home-page">
      <ThreadListContainer
        sectionHeader="Threads"
        noPostsMessage="No posts have been added yet! Be the first to add a post!"
        addPostButtonMessage="Create Post"
      />
    </section>
  );
}
