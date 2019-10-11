import * as React from 'react';
import { observer } from 'mobx-react';
import ThreadListContainer from '../../components/Post/ThreadListContainer';
import './HomePage.less';

/**
 * A React component that renders the Page layout for the home page
 * @component
 */
function HomePage(props: {}) {
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

export default observer(HomePage);
