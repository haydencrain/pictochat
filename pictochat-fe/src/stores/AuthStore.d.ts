import { User } from '../models/store/User';
import UnauthenticatedUser from '../models/UnauthenticatedUser';
interface IAuthStore {
    /**
     * The currently logged in users
     */
    currentUser: User;
    /**
     * Set to true if the current user is in the process of logging in or logging out
     */
    isLoading: boolean;
    /**
     * Whether the current user is logged in successfully (aka whether a current user is present within the store)
     */
    isLoggedIn: boolean;
}
/**
 * Creates a new observable instance, which stores and coordinates updates for the currently logged in user
 * @class
 */
export default class AuthStore implements IAuthStore {
    currentUser: User;
    isLoading: boolean;
    isLoggedIn: boolean;
    constructor();
    /**
     * Automatically fetches the current user if one is already logged in
     * @function
     */
    init(): Promise<void>;
    /**
     * Handles registration of a new user, and logs them in as the current user
     * @function
     * @param userJson - The registration data
     */
    createUserAndAuth(userJson: UnauthenticatedUser): Promise<User>;
    /**
     * Handles authentication and logging in of a user
     * @param userCredentials - The login details of the user to authenticate
     */
    authAndLoadCurrentUser(userCredentials: UnauthenticatedUser): Promise<void>;
    /**
     * Removes the current user (logs out)
     * @function
     */
    logout(): Promise<void>;
    /**
     * Sets the current user
     * @param user - The new user to set
     */
    private setCurrentUser;
}
export {};
