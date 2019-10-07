import * as React from 'react';
import { Segment } from 'semantic-ui-react';
import classnames from 'classnames';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import StoresContext from '../../contexts/StoresContext';
import { observer } from 'mobx-react';
import './QuickLinks.less';
import { computed } from 'mobx';

interface Links {
  name: string;
  link: string;
  isActive: (pathname: string) => any;
}

const normalLinks: Links[] = [
  { name: 'Threads', link: '/', isActive: pathname => pathname.startsWith('/discussion') || pathname === '/' },
  { name: 'Leaderboard', link: '/leaderboard', isActive: pathname => pathname.startsWith('/leaderboard') },
  { name: 'Register', link: '/register', isActive: pathname => pathname.startsWith('/register') }
];

const adminLinks: Links[] = [
  {
    name: 'Sock Puppets',
    link: '/sock-puppets',
    isActive: pathname => pathname.startsWith('/sock-puppets')
  },
  { name: 'Reports', link: '/reports', isActive: pathname => pathname.startsWith('/reports') }
];

function QuickLinks(props: RouteComponentProps<{}>) {
  const userStore = React.useContext(StoresContext).user;

  const isAdmin = computed(() => userStore.isLoggedIn && userStore.currentUser.hasAdminRole);

  const getLinkSegments = (links: Links[]) =>
    links.map(link => {
      const active = link.isActive(props.location.pathname);
      const className = classnames('links-list-item', 'ui segment', { active });
      return (
        <Link key={link.link} to={link.link} className={className}>
          {link.name}
        </Link>
      );
    });

  return (
    <section id="quick-links">
      <h2>Quick Links</h2>
      <Segment.Group raised className="links-list">
        {getLinkSegments(normalLinks)}
        {isAdmin.get() && getLinkSegments(adminLinks)}
      </Segment.Group>
    </section>
  );
}

export default observer(withRouter(QuickLinks));
