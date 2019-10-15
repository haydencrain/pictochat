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

/**
 * A React component that displays a ranked list of users, ordered by the number of posts
 * @param { LeaderboardProps } props - The props of the component
 */
export function Leaderboard(props: LeaderboardProps) {
  const { ranks } = props;

  /* RENDERING HELPERS*/
  const getContent = () => {
    if (ranks.length == 0) {
      // show placeholder
      return <p>No users to show</p>;
    }

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
          <div className="row"><h5>Posts: {rank.postCount}</h5></div>
        </div>
      </Segment>
    ));

  };

  /* MAIN RENDERING */
  return (
    <section id="leaderboard-section">
      <h1>Leaderboard</h1>
      <Segment.Group raised>{getContent()}</Segment.Group>
    </section>
  );
}

export default observer(Leaderboard);
