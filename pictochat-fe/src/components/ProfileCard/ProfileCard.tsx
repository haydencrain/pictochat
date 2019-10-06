import * as React from 'react';
import { Segment, Rating, Image } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { User } from '../../models/User';
import './ProfileCard.less';

interface Props {
  user: User;
  onLogoutClick: () => void;
}

function ProfileCard(props: Props) {
  return (
    <Segment.Group className="profile-card" raised>
      <Segment className="profile-card-header" horizontal="true">
        <div className="header-image">
          <Image src={props.user.userAvatarURI} />
          {/*<Image src="https://semantic-ui.com/images/avatar2/large/elyse.png" />*/}
        </div>
        <div className="header-info">
          <div className="user-name">{props.user.username}</div>
          <div className="user-rating">
            <label>Rating</label>
            <span className="value">4.05</span>
            <Rating className="rating-stars" icon="star" defaultRating={4.05} maxRating={5} disabled />
          </div>
        </div>
      </Segment>
      <Segment className="profile-card-body">
        <div className="user-statistic">
          <label>Thread Score</label>
          <span className="value">295</span>
        </div>
        <div className="user-statistic">
          <label>Comment Score</label>
          <span className="value">35</span>
        </div>
      </Segment>
      <Segment className="profile-card-footer">
        <ul>
          {/*<li>
            <a>View Profile</a>
          </li>
          <li>
            <a>Settings</a>
          </li>*/}
          <li>
            <a onClick={props.onLogoutClick}>Logout</a>
          </li>
        </ul>
      </Segment>
    </Segment.Group>
  );
}

export default observer(ProfileCard);
