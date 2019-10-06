import * as React from 'react';
import { observer } from 'mobx-react';
import ThreadListContainer from '../../components/ThreadListContainer';
import './UserPage.less';

interface UserPageProps {}

function UserPage(props: UserPageProps) {
  return <section id="user-page">Hello world this is me life s hould be uh huh fun for everyone</section>;
}

export default observer(UserPage);
