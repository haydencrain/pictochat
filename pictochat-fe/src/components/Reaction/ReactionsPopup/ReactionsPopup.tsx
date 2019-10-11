import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { useToggleModal } from '../../../hooks/ModalHooks';
import { Popup, Button } from 'semantic-ui-react';
import ReactionPopupItem from './ReactionPopupItem';
import { reactions } from '../helpers';

interface ReactionsPopupProps {
  /**
   * A callback function that fires when the popup trigger has been clicked
   * @function
   * @param { string } reactionName - The name of the reaction clicked
   */
  onClick: (reactionName: string) => void;
}

/**
 * A React component that provides a popup of reactions, allowing a user to select a reaction
 * @param { ReactionsPopupProps } props - The props of the component
 */
function ReactionsPopup(props: ReactionsPopupProps) {
  const { isActive, onOpen, onClose } = useToggleModal();

  const reactionItems = reactions.map(reaction => {
    const handleClick = () => props.onClick(reaction.name);
    return <ReactionPopupItem key={`reactionPopup_${reaction.name}`} icon={reaction.icon} onClick={handleClick} />;
  });

  const content = <ul className="react-content">{reactionItems}</ul>;

  return (
    <Popup
      content={content}
      open={isActive}
      onOpen={onOpen}
      onClose={onClose}
      on="click"
      trigger={<Button icon="add" />}
    />
  );
}

export default observer(ReactionsPopup);
