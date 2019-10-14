import { IUser } from '../models/store/User';
import UnauthenticatedUser from '../models/UnauthenticatedUser';
/**
 * Implements HTTP Requests for the `'/user'` API endpoint
 * @class
 * @static
 */
declare class UserService {
    static getUserUrl(username: string): string;
    static getUser(username: string): Promise<IUser>;
    static getCurrentUser(): Promise<IUser>;
    static hasValidSession(): Promise<boolean>;
    static authUser(user: UnauthenticatedUser): Promise<string>;
    static clearSession(): Promise<void>;
    static addUser(user: UnauthenticatedUser, shouldAuthenticate?: boolean): Promise<IUser>;
    static disableUser(user: IUser): Promise<void>;
    private static maybeSetSessionToken;
}
export default UserService;
