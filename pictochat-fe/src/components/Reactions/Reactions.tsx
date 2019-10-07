import * as React from 'react';
import { Button, Popup, Label, Loader } from 'semantic-ui-react';
import { useFetchReactions } from '../../hooks/ReactionHooks';
import reactionService from '../../services/ReactionService';
import './Reactions.less';
import StoresContext from '../../contexts/StoresContext';
import { useToggleModal } from '../../hooks/ModalHooks';
import { Reaction } from '../../models/Reaction';
import { observer } from 'mobx-react';

const REACTIONS = [
  { icon: '👍', name: 'thumbs-up' },
  { icon: '👎', name: 'thumbs-down' },
  { icon: '😂', name: 'laugh' },
  { icon: '😍', name: 'heart' },
  { icon: '😡', name: 'angry' }
];

interface ReactionsProps {
  postId: number;
}

function Reactions(props: ReactionsProps) {
  const stores = React.useContext(StoresContext);
  const userStore = stores.user;
  const reactionStore = stores.reaction;
  const currentUser = stores.user.currentUser;
  const reactionTypeCounts = reactionStore.postReactionNameCounts(props.postId);

  // console.log('reactionTypeCounts: ', reactionTypeCounts);
  // console.log('reactionStore.reactionStore.postUserReactionsMap:', JSON.stringify(reactionStore.postUserReactionsMap));

  if (reactionStore.isLoading) {
    return <Loader/>;
  }

  //// EVENT HANDLERS ////

  const handleReactionLabelClick = async (reactionName: string) => {
    if (!userStore.isLoggedIn) {
      alert('You must login to add reactions');
      return;
    }
    await reactionStore.updateReaction(props.postId, parseInt(currentUser.userId), reactionName);
  };

  //// RENDER HELPERS ////

  const renderReactionLabels = () => {
    return REACTIONS.map((reactionType: any) => {
      if (reactionTypeCounts[reactionType.name] === undefined) {
        return null;
      }
      return (
        <Label as="a" key={reactionType.name} onClick={() => handleReactionLabelClick(reactionType.name)}>
          <p className="icon"> {reactionType.icon}</p> <p className="num">{reactionTypeCounts[reactionType.name]}</p>
        </Label>
      );
    });
  };

  return (
    <section className="reactions">
      <ReactionsPopUp onClick={handleReactionLabelClick} />
      <div className="curr-react">{renderReactionLabels()}</div>
    </section>
  );
}

// function ReactionsV1(props: ReactionsProps) {
//   const stores = React.useContext(StoresContext);
//   const currentUser = stores.user.currentUser;

//   // const [reactions, isLoading] = useFetchReactions(props.postId);

//   //TODO: arrange by reaction and then get the subsequent counts

//   const addReaction = (reactionName: string) => {
//     return reactionService.addReaction(reactionName, props.postId, Number(currentUser.userId));
//   };

//   //TODO: Fix trash code that won't sort reactions
//   // let reactionCount = async (reactionName: string) => {
//   //   let rCount: Reaction[] = await reactionService.getReactionsPost(props.postId);
//   //   let r = rCount.filter(react => {
//   //     return react.reactionName === reactionName;
//   //   }).length;
//   //   console.log(r);
//   //   return r;
//   // };

//   // console.log('React ' + Number(reactionCount('thumbs-up')));

//   const currentReactions = REACTIONS.map((react, index) => (
//     <Label as="a" key={index} onClick={() => addReaction(react.name)}>
//       <p className="icon"> {react.icon}</p> <p className="num">1</p>
//     </Label>
//   ));

//   return (
//     <section className="reactions">
//       <PopupReactions increaseReactionCount={addReaction} />
//       <div className="curr-react">{currentReactions}</div>
//     </section>
//   );
// }

interface ReactionsPopUpProps {
  onClick: (reactionName: string) => void;
}

const ReactionsPopUp = observer(function ReactionsPopUp(props: ReactionsPopUpProps) {
  const reactionStore = React.useContext(StoresContext);
  const { isActive, onOpen, onClose } = useToggleModal();

  // const handleClickedReaction = (reactionName: string) => {
  //   // props.increaseReactionCount(reactionName);
  // };

  const content = (
    <ul className="react-content">
      <li className="reaction-icon" onClick={() => props.onClick('thumbs-up')}>
        👍
      </li>
      <li className="reaction-icon" onClick={() => props.onClick('thumbs-down')}>
        👎
      </li>
      <li className="reaction-icon" onClick={() => props.onClick('laugh')}>
        😂
      </li>
      <li className="reaction-icon" onClick={() => props.onClick('heart')}>
        😍
      </li>
      <li className="reaction-icon" onClick={() => props.onClick('angry')}>
        😡
      </li>
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
});

export default observer(Reactions);
