import * as React from 'react';
import { observer } from 'mobx-react';
import { Loader } from 'semantic-ui-react';
import { isUndefined } from 'util';
import { reactions } from '../helpers';
import StoresContext from '../../../contexts/StoresContext';
import ReactionsPopup from '../ReactionsPopup/ReactionsPopup';
import ReactionChip from '../ReactionChip';
import './ReactionsContainer.less';

interface ReactionsProps {
  postId: string;
  shouldLoad?: boolean;
}

function ReactionsContainer(props: ReactionsProps) {
  const shouldLoad = props.shouldLoad !== undefined ? props.shouldLoad : false;
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
    return reactions.map(reaction => {
      const count = reactionTypeCounts[reaction.name];
      if (isUndefined(count)) {
        return null;
      }
      const handleClick = () => handleReactionLabelClick(reaction.name);
      return (
        <ReactionChip key={`reaction_chip_${reaction.name}`} reaction={reaction} count={count} onClick={handleClick} />
      );
    });
  };

  //// MAIN RENDERING /////

  if (reactionStore.isLoading || isLoading) {
    return <Loader />;
  }

  return (
    <section className="reactions">
      <ReactionsPopup onClick={handleReactionLabelClick} />
      <div className="curr-react">{renderReactionLabels()}</div>
    </section>
  );
}

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

export default observer(ReactionsContainer);
