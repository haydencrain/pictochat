import { ObservableMap } from 'mobx';
import { SockPuppetAlert } from '../models/store/SockPuppetAlert';
import UserStore from './UserStore';
interface ISockPuppetAlertStore {
    /**
     * Stores the list of users for each Sock puppet alert
     */
    userStore: UserStore;
    /**
     * Set to true if Sock puppets are currently fetching
     */
    isLoading: boolean;
    /**
     * Stores the lsit of sock puppet alerts
     */
    alertMap: ObservableMap<any, SockPuppetAlert>;
}
export declare class SockPuppetAlertStore implements ISockPuppetAlertStore {
    userStore: UserStore;
    isLoading: boolean;
    alertMap: ObservableMap<any, SockPuppetAlert>;
    constructor(userStore: UserStore);
    loadAlerts(userLimit: number): Promise<void>;
    readonly alerts: SockPuppetAlert[];
}
export {};
