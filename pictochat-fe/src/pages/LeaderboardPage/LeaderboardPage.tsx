import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { observer } from 'mobx-react';
import Leaderboard from '../../components/User/Leaderboard';
import StoresContext, { IStoresContext } from '../../contexts/StoresContext';
import './LeaderboardPage.less';

/**
 * A React component that interacts with the store to load the leaderboard, and renders the Page layout
 * for the Leaderboard page.
 * @component
 */
export function LeaderboardPage(props: {}) {
  const stores: IStoresContext = React.useContext(StoresContext);

  React.useEffect(() => {
    stores.leaderboard.loadLeaderboard();
  });

  return (
    <section id="leaderboard-page">
      <Leaderboard ranks={stores.leaderboard.ranks} />
    </section>
  );
}

export default observer(LeaderboardPage);
