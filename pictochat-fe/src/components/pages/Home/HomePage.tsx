import * as React from 'react';
import './HomePage.less';
import ProfileCard from '../../common/ProfileCard';

interface HomePage {}

export default (props: HomePage) => {
  return (
    <section id="home-page">
      <ProfileCard />
    </section>
  );
};
