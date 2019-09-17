import * as React from 'react';
import DiscussionStore from '../stores/DiscussionStore';
import UserStore from '../stores/UserStore';

export interface IStoresContext {
  discussion: DiscussionStore;
  user: UserStore;
}

// HELPER FUNCTIONS

export function initStores(): IStoresContext {
  return { discussion: new DiscussionStore(), user: new UserStore() };
}

// CONTEXT
export const StoresContext = React.createContext<IStoresContext>(undefined);
export default StoresContext;
