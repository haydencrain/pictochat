import * as React from 'react';
import { observer } from 'mobx-react';
import ThreadListContainer from '../../components/ThreadListContainer';
import './UserPage.less';

interface UserPageProps {}

function UserPage(props: UserPageProps) {
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

export default observer(UserPage);
