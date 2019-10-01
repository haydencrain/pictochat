import * as React from 'react';
import DiscussionStore from '../stores/DiscussionStore';
import UserStore from '../stores/UserStore';
import { LeaderboardStore } from '../stores/LeaderboardStore';

export interface IStoresContext {
  discussion: DiscussionStore;
  user: UserStore;
  leaderboard: LeaderboardStore;
}

// HELPER FUNCTIONS

export function initStores(): IStoresContext {
  return {
    discussion: new DiscussionStore(),
    user: new UserStore(),
    leaderboard: new LeaderboardStore()
  };
}

// CONTEXT
export const StoresContext = React.createContext<IStoresContext>(undefined);
export default StoresContext;
