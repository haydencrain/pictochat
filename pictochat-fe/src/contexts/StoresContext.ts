import * as React from 'react';
import DiscussionStore from '../stores/DiscussionStore';

export interface IStoresContext {
  discussion: DiscussionStore;
}

// HELPER FUNCTIONS

export function initStores(): IStoresContext {
  return { discussion: new DiscussionStore() };
}

// CONTEXT
export const StoresContext = React.createContext<IStoresContext>(undefined);
export default StoresContext;
