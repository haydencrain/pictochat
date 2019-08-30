import * as React from 'react';

import Leaderboard from '../../components/Leaderboard';
import './LeaderboardPage.less';

interface LeaderboardPage {}

export default (props: LeaderboardPage) => {
  return (
    <section id="leaderboard-page">
      <Leaderboard />
    </section>
  );
};
