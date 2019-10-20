import * as React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.less';

/**
 * A React component that renders the navigation bar of the application
 * @component
 */
export default (props: {}) => (
  <nav id="navbar">
    <Link id="navbar-title" to="/">
      Pictochat
    </Link>
  </nav>
);
