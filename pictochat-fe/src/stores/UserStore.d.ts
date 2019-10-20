import { ObservableMap } from 'mobx';
import { User } from '../models/store/User';
interface IUserStore {
    /**
     * Set to true if the store is currently loading or updating users
     */
    isLoading: boolean;
    /**
     * This is used a generic cache if any UI elements need to incorporate data about users other than the one currently logged in
     */
    userMap: ObservableMap<any, User>;
}
export default class UserStore implements IUserStore {
    isLoading: boolean;
    userMap: ObservableMap<any, User>;
    constructor();
    /**
     * WARNING: Converting this into an arrow function will break computedFn
     * As noted: https://mobx.js.org/refguide/computed-decorator.html */
    hasUser: (...args: any[]) => any;
    fetchUser(username: string): Promise<void>;
    putInUserMap(user: User): User;
    disableUser: (user: User) => import("mobx/lib/internal").CancellablePromise<void>;
}
export {};
