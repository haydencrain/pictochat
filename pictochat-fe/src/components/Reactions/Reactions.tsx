import * as React from 'react';
import { Button, Popup, Label } from 'semantic-ui-react';
import { useBooleanKnob } from '@stardust-ui/docs-components';
import { useFetchReactions } from '../../hooks/ReactionHooks';
import reactionService from '../../services/ReactionService';
import './Reactions.less';
import StoresContext from '../../contexts/StoresContext';

const reactions = [{ icon: '👍' }, { icon: '👎' }, { icon: '😂' }, { icon: '😍' }, { icon: '😡' }];
const stores = React.useContext(StoresContext);
const currentUser = stores.user.currentUser;

const AddReaction = () => {
  const [eventEnabled] = useBooleanKnob({
    name: 'eventEnabled',
    initialValue: true
  });

  const [open, setOpen] = useBooleanKnob({ name: 'open' });

  return (
    <Popup
      content="👍 👎 😂 😍 😡"
      eventEnabled={eventEnabled}
      on="click"
      onOpen={() => setOpen(true)}
      trigger={<Button icon="add" />}
    />
  );
};

const CurrentReactions = reactions.map((react, index) => (
  <Label key={index}>
    <p className="icon">{react.icon}</p> <p>1</p>
  </Label>
));

export default () => (
  <section className="reactions">
    <AddReaction />
    <div className="curr-react">{CurrentReactions}</div>
  </section>
);
