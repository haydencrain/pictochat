import * as React from 'react';
import { observer } from 'mobx-react';
import { Segment } from 'semantic-ui-react';
import classnames from 'classnames';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { Links, normalLinks } from './helpers';
import './QuickLinks.less';

/**
 * React component that supplies links to important routes within the application
 * @component
 * @param props (RouteComponentProps)
 */
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
