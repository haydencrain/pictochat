import * as React from 'react';
import { Container, Header, Image, Rating } from 'semantic-ui-react';

import './Leaderboard.less';

const RateUsers = () => <Rating icon="star" defaultRating={3} maxRating={5} disabled />;

const users = [
  { name: 'Elyse Prowell', image: 'https://semantic-ui.com/images/avatar2/large/elyse.png', score: '391' },
  { name: 'Kristy Burgess', image: 'https://semantic-ui.com/images/avatar2/large/kristy.png', score: '385' },
  { name: 'Matthew Wallace', image: 'https://semantic-ui.com/images/avatar2/large/matthew.png', score: '373' },
  { name: 'Molly Clark', image: 'https://semantic-ui.com/images/avatar2/large/molly.png', score: '371' },
  { name: 'Stevie Newman', image: 'https://semantic-ui.com/images/avatar/large/stevie.jpg', score: '350' }
];

const UserInfo = users.map(user => (
  <div className="ui two column grid" key={user.name}>
    <div className="row">
      <div className="four wide column">
        <Image src={user.image} size="tiny" circular />
      </div>
      <div id="info-col" className="column">
        <div id="info-username" className="row">
          <h3> {user.name} </h3>
        </div>
        <div id="info-rating" className="row">
          <RateUsers />
        </div>
        <div className="row">
          <h5> Thread Score: {user.score} </h5>
        </div>
      </div>
    </div>
  </div>
));

export default (props: {}) => (
  <Container id="leaderboard" className="ui segment">
    <Header as="h2">Leaderboard</Header>
    <div>{UserInfo}</div>
  </Container>
);
