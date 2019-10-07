import * as React from 'react';
import { Button, Popup, Label, Loader } from 'semantic-ui-react';
// import { useFetchReactions } from '../../hooks/ReactionHooks';
import './Reactions.less';
import StoresContext from '../../contexts/StoresContext';
import { useToggleModal } from '../../hooks/ModalHooks';
import { observer } from 'mobx-react';
import { trace } from 'mobx';

const REACTIONS = [
  { icon: '👍', name: 'thumbs-up' },
  { icon: '👎', name: 'thumbs-down' },
  { icon: '😂', name: 'laugh' },
  { icon: '😍', name: 'heart' },
  { icon: '😡', name: 'angry' }
];

interface ReactionsProps {
  postId: string;
  shouldLoad?: boolean
}

function Reactions(props: ReactionsProps) {
  const shouldLoad = (props.shouldLoad !== undefined) ? props.shouldLoad : false;
  const stores = React.useContext(StoresContext);
  const userStore = stores.user;
  const reactionStore = stores.reaction;
  const currentUser = stores.user.currentUser;
  const reactionTypeCounts = reactionStore.postReactionNameCounts(props.postId);

  const isLoading = useFetchReactionTypeCounts(props.postId, shouldLoad);

  //// EVENT HANDLERS ////

  const handleReactionLabelClick = React.useCallback((reactionName: string) => {
    if (!userStore.isLoggedIn) {
      alert('You must login to add reactions');
      return;
    }
    reactionStore.updateReaction(parseInt(props.postId), parseInt(currentUser.userId), reactionName);
  }, []);

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

  //// MAIN RENDERING /////

  if (reactionStore.isLoading || isLoading) {
    return <Loader/>;
  }

  return (
    <section className="reactions">
      <ReactionsPopUp onClick={handleReactionLabelClick} />
      <div className="curr-react">{renderReactionLabels()}</div>
    </section>
  );
}

interface ReactionsPopUpProps {
  onClick: (reactionName: string) => void;
}

const ReactionsPopUp = observer(function ReactionsPopUp(props: ReactionsPopUpProps) {
  const { isActive, onOpen, onClose } = useToggleModal();

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


///// HOOKS /////

/**
 * Use this to load the reactions for the specified post on component render
 * This is used, for example, in the threads summary list
 */
function useFetchReactionTypeCounts(postId: string, shouldLoad: boolean): boolean {
  const store = React.useContext(StoresContext).reaction;
  const [isLoading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (shouldLoad) {
      setLoading(true);
      store.fetchPostReactions(parseInt(postId)).then(() => setLoading(false));
    }
  }, [postId, shouldLoad]);

  return isLoading;
}


export default observer(Reactions);
