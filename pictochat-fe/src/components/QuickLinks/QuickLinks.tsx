import * as React from 'react';
import { Segment } from 'semantic-ui-react';
import classnames from 'classnames';
import './QuickLinks.less';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';

const links = [
  { name: 'Threads', link: '/', isActive: pathname => pathname.startsWith('/discussion') || pathname === '/' },
  { name: 'Leaderboard', link: '/leaderboard', isActive: pathname => pathname.startsWith('/leaderboard') },
  { name: 'Register', link: '/register', isActive: pathname => pathname.startsWith('/register') }
];

function QuickLinks(props: RouteComponentProps<{}>) {
  const linkSegments = links.map(link => {
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
        {linkSegments}
      </Segment.Group>
    </section>
  );
}

export default withRouter(QuickLinks);
