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
  /**
   * The id of the post the reactions belong to
   */
  postId: string;
  /**
   * Set to false if the reactions for this post should be loaded
   */
  shouldLoad?: boolean;
}

/**
 * A React component that fetches and displays the reactions of a post, and also handles passes CRUD operations to
 * the reactions store.
 * @param { ReactionsProps } props - The props of the component
 */
function ReactionsContainer(props: ReactionsProps) {
  const shouldLoad = props.shouldLoad !== undefined ? props.shouldLoad : false;
  /* STORE */
  const stores = React.useContext(StoresContext);
  const authStore = stores.auth;
  const reactionStore = stores.reaction;
  const currentUser = authStore.currentUser;

  const reactionTypeCounts = reactionStore.postReactionNameCounts(props.postId);

  const isLoading = useFetchReactionTypeCounts(props.postId, shouldLoad);

  /* EVENT HANDLERS */

  const handleReactionLabelClick = React.useCallback((reactionName: string) => {
    if (!authStore.isLoggedIn) {
      alert('You must login to add reactions');
      return;
    }
    reactionStore.updateReaction(parseInt(props.postId), parseInt(currentUser.userId), reactionName);
  }, []);

  /* RENDER HELPERS */

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

  /* MAIN RENDERING */

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

/* HOOKS */

/**
 * A React Hook that loads the reactions for the specified post on component render.
 * @function
 * @param postId - The id of the post to fetch the reactions of.
 * @param shouldLoad - Set this to false if you would not like to load the reactions for the specified post
 * @returns A boolean specifying whether reactions are loading or not
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
