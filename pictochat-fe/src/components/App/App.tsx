import * as React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import Navbar from '../common/Navbar';
import './App.less';

export default () => (
  <BrowserRouter>
    <Navbar />
    <main id="main-content">
      <Switch></Switch>
    </main>
  </BrowserRouter>
);
