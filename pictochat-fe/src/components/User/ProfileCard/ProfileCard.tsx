import * as React from 'react';
import { Segment, Rating, Image } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { User } from '../../../models/store/User';
import './ProfileCard.less';
import { Link } from 'react-router-dom';

interface LoginProps {
  /**
   * The user to display within the card
   */
  user: User;
  /**
   * Set true to render a list of links, such as logout and view profile
   */
  isCurrentUser?: boolean;
  /**
   * Callback function that executes when the logout link is clicked
   * @function
   */
  onLogoutClick?: () => void;
}

/**
 * A React component that displays a user profile in a card UI layout
 * @param { LoginProps } props - The props of the component
 */
function ProfileCard(props: LoginProps) {
  const linksSegment = !!props.isCurrentUser && (
    <Segment className="profile-card-footer">
      <ul>
        <li>
          <Link to={`/user/${props.user.username}`}>View Profile</Link>
        </li>
        {props.user.hasAdminRole && (
          <>
            <li>
              <Link to="/sock-puppets">Sock Puppets</Link>
            </li>
            <li>
              <Link to="/reports">Reports</Link>
            </li>
          </>
        )}
        <li>
          <a onClick={props.onLogoutClick}>Logout</a>
        </li>
      </ul>
    </Segment>
  );

  return (
    <Segment.Group className="profile-card" raised>
      <Segment className="profile-card-header" horizontal="true">
        <div className="header-image">
          <Image src={props.user.userAvatarURI} />
        </div>
        <div className="header-info">
          <div className="user-name">{props.user.username}</div>
          <div className="user-rating">
            <label>Rating</label>
            <span className="value">0.00</span>
            <Rating className="rating-stars" icon="star" defaultRating={0} maxRating={5} disabled />
          </div>
        </div>
      </Segment>
      <Segment className="profile-card-body">
        <div className="user-statistic">
          <label>Thread Score</label>
          <span className="value">n/a</span>
        </div>
        <div className="user-statistic">
          <label>Comment Score</label>
          <span className="value">n/a</span>
        </div>
      </Segment>
      {linksSegment}
    </Segment.Group>
  );
}

export default observer(ProfileCard);
