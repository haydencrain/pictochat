import * as React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.less';

export default (props: {}) => (
  <nav id="navbar">
    <Link className="title" to="/">
      Pictochat
    </Link>
  </nav>
);
