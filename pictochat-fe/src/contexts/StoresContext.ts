import * as React from 'react';
import DiscussionStore from '../stores/DiscussionStore';
import AuthStore from '../stores/AuthStore';
import UserStore from '../stores/UserStore';
import { LeaderboardStore } from '../stores/LeaderboardStore';
import { SockPuppetAlertStore } from '../stores/SockPuppetAlertStore';
import { ReactionStore } from '../stores/ReactionStore';

export interface IStoresContext {
  discussion: DiscussionStore;
  user: UserStore;
  auth: AuthStore;
  leaderboard: LeaderboardStore;
  sockPuppetAlerts: SockPuppetAlertStore;
  reaction: ReactionStore;
}

// HELPER FUNCTIONS

export function initStores(): IStoresContext {
  const userStore = new UserStore();
  return {
    discussion: new DiscussionStore(),
    user: userStore,
    auth: new AuthStore(),
    leaderboard: new LeaderboardStore(),
    sockPuppetAlerts: new SockPuppetAlertStore(userStore),
    reaction: new ReactionStore()
  };
}

// CONTEXT
export const StoresContext = React.createContext<IStoresContext>(undefined);
export default StoresContext;
