import * as React from 'react';
import { observer } from 'mobx-react';
import { Image, Segment } from 'semantic-ui-react';
import { LeaderboardRank } from '../../../models/store/LeaderboardRank';
import { Link } from 'react-router-dom';
import UserService from '../../../services/UserService';
import './Leaderboard.less';

interface LeaderboardProps {
  ranks: LeaderboardRank[];
}

export function Leaderboard(props: LeaderboardProps) {
  const { ranks } = props;

  const userInfo = ranks.map(rank => (
    <Segment className="user-row" key={`user_${rank.user.username}`}>
      <div className="user-avatar">
        <Image src={rank.user.userAvatarURI} size="tiny" circular />
      </div>
      <div className="user-info">
        <div id="info-username" className="row">
          <Link to={UserService.getUserUrl(rank.user.username)} className="link inherit">
            <h3>{rank.user.username}</h3>
          </Link>
        </div>
        <div className="row">{<h5>Posts: {rank.postCount}</h5>}</div>
      </div>
    </Segment>
  ));

  return (
    <section id="leaderboard-section">
      <h1>Leaderboard</h1>
      <Segment.Group raised>{userInfo}</Segment.Group>
    </section>
  );
}

export default observer(Leaderboard);
