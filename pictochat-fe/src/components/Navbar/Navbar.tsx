import * as React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.less';

export default (props: {}) => (
  <nav id="navbar">
    <Link id="navbar-title" to="/">
      Pictochat
    </Link>
  </nav>
);
