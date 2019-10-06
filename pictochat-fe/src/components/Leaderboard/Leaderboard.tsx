import * as React from 'react';
import { observer } from 'mobx-react';
import { Image, Segment } from 'semantic-ui-react';
import { LeaderboardRank } from '../../models/LeaderboardRank';
import './Leaderboard.less';

// const RateUsers = () => <Rating icon="star" defaultRating={3} maxRating={5} disabled />;

// const users = [
//   { name: 'Elyse Prowell', image: 'https://semantic-ui.com/images/avatar2/large/elyse.png', score: '391' },
//   { name: 'Kristy Burgess', image: 'https://semantic-ui.com/images/avatar2/large/kristy.png', score: '385' },
//   { name: 'Matthew Wallace', image: 'https://semantic-ui.com/images/avatar2/large/matthew.png', score: '373' },
//   { name: 'Molly Clark', image: 'https://semantic-ui.com/images/avatar2/large/molly.png', score: '371' },
//   { name: 'Stevie Newman', image: 'https://semantic-ui.com/images/avatar/large/stevie.jpg', score: '350' }
// ];

interface LeaderboardProps {
  ranks: LeaderboardRank[];
}

export function Leaderboard(props: LeaderboardProps) {
  const { ranks } = props;

  const userInfo = ranks.map(rank => (
    <div className="row user-row" key={rank.rank}>
      <div className="user-avatar">
        <Image src={rank.user.userAvatarURI} size="tiny" circular />
      </div>
      <div className="user-info">
        <div id="info-username" className="row">
          <h3> {rank.user.username} </h3>
        </div>
        {/*<div id="info-rating" className="row">
            <RateUsers />
           </div>*/}
        <div className="row">
          {<h5> Posts: {rank.postCount} </h5>}
          {/*<h5> Thread : {user.score} </h5>*/}
        </div>
      </div>
    </div>
  ));

  return (
    <section id="leaderboard-section">
      <h1>Leaderboard</h1>
      <Segment raised>{userInfo}</Segment>
    </section>
  );
}

export default observer(Leaderboard);
