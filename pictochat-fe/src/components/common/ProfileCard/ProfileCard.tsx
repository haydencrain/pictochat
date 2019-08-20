import * as React from 'react';
import { Segment, Rating, Image, Container } from 'semantic-ui-react';
import './ProfileCard.less';

interface Props {}

export default (props: Props) => {
  return (
    <Segment.Group className="profile-card" raised>
      <Segment.Group className="profile-card-header" horizontal>
        <Segment className="header-image">
          <Image src="https://semantic-ui.com/images/avatar2/large/elyse.png" />
        </Segment>
        <Segment className="header-info">
          <div className="user-name">Dosss</div>
          <div className="user-rating">
            <label>Thread Score</label>
            <span className="value">4.05</span>
            <Rating className="rating-stars" icon="star" defaultRating={4.05} maxRating={5} disabled />
          </div>
        </Segment>
      </Segment.Group>
      <Segment className="proflie-card-body">
        <div className="user-statistic">
          <label>Thread Score</label>
          <span className="value">295</span>
        </div>
        <div className="user-statistic">
          <label>Comment Score</label>
          <span className="value">35</span>
        </div>
      </Segment>
      <Segment className="proflie-card-footer">
        <ul>
          <li>
            <a>View Settings</a>
          </li>
          <li>
            <a>View Settings</a>
          </li>
          <li>
            <a>View Settings</a>
          </li>
        </ul>
      </Segment>
    </Segment.Group>
  );
};
