import * as React from 'react';
import { Segment } from 'semantic-ui-react';
import classnames from 'classnames';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { observer } from 'mobx-react';
import './QuickLinks.less';

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

function QuickLinks(props: RouteComponentProps<{}>) {
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
      </Segment.Group>
    </section>
  );
}

export default observer(withRouter(QuickLinks));
