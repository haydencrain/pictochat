import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { useToggleModal } from '../../../hooks/ModalHooks';
import { Popup, Button } from 'semantic-ui-react';
import ReactionPopupItem from '../ReactionPopupItem';
import { reactions } from '../helpers';

interface ReactionsPopupProps {
  onClick: (reactionName: string) => void;
}

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
