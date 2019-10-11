import * as React from 'react';
import DiscussionStore from '../stores/DiscussionStore';
import AuthStore from '../stores/AuthStore';
import UserStore from '../stores/UserStore';
import { LeaderboardStore } from '../stores/LeaderboardStore';
import { SockPuppetAlertStore } from '../stores/SockPuppetAlertStore';
import { ReactionStore } from '../stores/ReactionStore';
import ActiveDiscussionStore from '../stores/ActiveDiscussionStore';

export interface IStoresContext {
  auth: AuthStore;
  user: UserStore;
  discussion: DiscussionStore;
  activeDiscussion: ActiveDiscussionStore;
  leaderboard: LeaderboardStore;
  sockPuppetAlerts: SockPuppetAlertStore;
  reaction: ReactionStore;
}

// HELPER FUNCTIONS

export function initStores(): IStoresContext {
  const userStore = new UserStore();
  const discussionStore = new DiscussionStore();
  return {
    auth: new AuthStore(),
    user: userStore,
    discussion: discussionStore,
    activeDiscussion: new ActiveDiscussionStore(discussionStore),
    leaderboard: new LeaderboardStore(),
    sockPuppetAlerts: new SockPuppetAlertStore(userStore),
    reaction: new ReactionStore()
  };
}

// CONTEXT
export const StoresContext = React.createContext<IStoresContext>(undefined);
export default StoresContext;
