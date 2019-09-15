import * as React from 'react';
import DiscussionStore from '../stores/DiscussionStore';

export interface IStoresContext {
  discussion: DiscussionStore;
}

let initialRootStore: IStoresContext = undefined; // Defines context value type
const StoresContext = React.createContext(initialRootStore);

export default StoresContext;
