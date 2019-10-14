export interface IUser {
    /**
     * The username of the user
     */
    username: string;
    /**
     * The email of the user
     */
    email: string;
    /**
     * The id of the user
     */
    userId: string;
    /**
     * The URI of the user's avatar
     */
    userAvatarURI: string;
    /**
     * If true, the user has been  banned, and will be unable to log into the account
     */
    isDisabled?: boolean;
    /**
     * If true, this user is an administrator
     */
    hasAdminRole: boolean;
}
/**
 * Creates an mobx ovservable instance of a User, and provides extra methods for
 * handling CRUD updates.
 * @class
 */
export declare class User implements IUser {
    username: string;
    email: string;
    userId: string;
    userAvatarURI: string;
    isDisabled: boolean;
    hasAdminRole: boolean;
    constructor(data?: IUser);
    /**
     * Disables this user, and prevents them from logging in
     * @function
     */
    disable(): void;
    /**
     * Replaces this instance's user with another instance of a user
     * @function
     * @param { User } other - The post to replace this instance with
     */
    replace(other: User): void;
    /**
     * Replaces this instance's post with an empty user
     * @function
     */
    clear(): void;
}
export default User;
