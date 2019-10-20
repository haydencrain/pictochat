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
/**
 * Creates the mobx stores
 * @returns (IStoresContext) The collection of stores
 */
export declare function initStores(): IStoresContext;
export declare const StoresContext: React.Context<IStoresContext>;
export default StoresContext;
