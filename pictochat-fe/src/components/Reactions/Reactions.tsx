import * as React from 'react';
import { Button, Popup, Label } from 'semantic-ui-react';
import { useBooleanKnob } from '@stardust-ui/docs-components';

import './Reactions.less';

const reactions = [{ icon: '👍' }, { icon: '👎' }, { icon: '😂' }, { icon: '😍' }, { icon: '😡' }];

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
      // open={open}
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
