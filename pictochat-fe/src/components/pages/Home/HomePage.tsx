import * as React from 'react';
import ProfileCard from '../../common/ProfileCard';
import './HomePage.less';

interface HomePage {}

export default (props: HomePage) => {
  return (
    <section id="home-page">
      Home Page
      <ProfileCard />
    </section>
  );
};
