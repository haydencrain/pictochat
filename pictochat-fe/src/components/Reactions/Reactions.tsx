import * as React from 'react';
import { Button, Popup, Label } from 'semantic-ui-react';
import { useFetchReactions } from '../../hooks/ReactionHooks';
import reactionService from '../../services/ReactionService';
import './Reactions.less';
import StoresContext from '../../contexts/StoresContext';
import { useToggleModal } from '../../hooks/ModalHooks';

const REACTIONS = [{ icon: '👍' }, { icon: '👎' }, { icon: '😂' }, { icon: '😍' }, { icon: '😡' }];

interface ReactionsProps {
  postId: number;
}

function Reactions(props: ReactionsProps) {
  const stores = React.useContext(StoresContext);
  const currentUser = stores.user.currentUser;

  const [reactions, isLoading] = useFetchReactions(props.postId);

  //TODO: arrange by reaction and then get the subsequent counts

  const addReaction = (reactionName: string) => {};

  const currentReactions = REACTIONS.map((react, index) => (
    <Label key={index} onClick={() => addReaction('name')}>
      <p className="icon"> {react.icon}</p> <p>1</p>
    </Label>
  ));

  return (
    <section className="reactions">
      <PopupReactions increaseReactionCount={addReaction} />
      <div className="curr-react">{currentReactions}</div>
    </section>
  );
}

interface ReactionPopUpProps {
  increaseReactionCount: (reactionName: string) => void;
}

function PopupReactions(props: ReactionPopUpProps) {
  const { isActive, onOpen, onClose } = useToggleModal();

  const handleClickedReaction = (reactionName: string) => {
    props.increaseReactionCount(reactionName);
  };

  const content = (
    <ul>
      <li onClick={() => handleClickedReaction('thumbs-up')}>REACTIONS.icon[0]</li>
      <li onClick={() => handleClickedReaction('thumbs-down')}>REACTIONS.icon[1]</li>
      <li onClick={() => handleClickedReaction('laugh')}>REACTIONS.icon[2]</li>
      <li onClick={() => handleClickedReaction('heart')}>REACTIONS.icon[3]</li>
      <li onClick={() => handleClickedReaction('angry')}>REACTIONS.icon[4]</li>
    </ul>
  );

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

export default Reactions;
