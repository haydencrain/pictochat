import React from 'react';
import { ReactionIcon } from '../helpers';
import { LabelProps, Label } from 'semantic-ui-react';

interface ReactionChipProps {
  reaction: ReactionIcon;
  count: number;
  onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>, data: LabelProps) => void;
}

export default function ReactionChip(props: ReactionChipProps) {
  const { count, reaction, onClick } = props;
  return (
    <Label as="a" key={reaction.name} onClick={onClick}>
      <p className="icon">{reaction.icon}</p>
      <p className="num">{count}</p>
    </Label>
  );
}
