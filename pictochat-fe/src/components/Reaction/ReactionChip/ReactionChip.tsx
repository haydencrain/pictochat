import React from 'react';
import { ReactionIcon } from '../helpers';
import { LabelProps, Label } from 'semantic-ui-react';

interface ReactionChipProps {
  /**
   * The reaction to display
   */
  reaction: ReactionIcon;
  /**
   * The count of the reaction
   */
  count: number;
  /**
   * Callback function that executes when the chip is clicked
   * @function
   * @param event - the MouseEvent object
   * @param data - the props of the semantic-ui Label component
   */
  onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>, data: LabelProps) => void;
}

/**
 * A React component that creates a clickable chip, containing a place to render an icon, as well as display its count
 * @param { ReactionChipProps } props - The props of the component
 */
export default function ReactionChip(props: ReactionChipProps) {
  const { count, reaction, onClick } = props;
  return (
    <Label as="a" key={reaction.name} onClick={onClick}>
      <p className="icon">{reaction.icon}</p>
      <p className="num">{count}</p>
    </Label>
  );
}
