import User, { IUser } from './User';
export interface ISockPuppetAlert {
    /**
     * The device id of the suspicious device
     */
    deviceId: string;
    /**
     * The users who have used the suspicious device
     */
    users: IUser[];
}
/**
 * Creates an observable instance of SockPuppetAlert
 * @class
 */
export declare class SockPuppetAlert {
    deviceId: string;
    users: User[];
    constructor(data?: {
        deviceId: string;
        users: User[];
    });
    /**
     * Replaces the current instance of a Sock puppet with another instance
     * @param { SockPuppetAlert } other - The other instance to replace this Sock Puppet with
     */
    replace(other: SockPuppetAlert): void;
}
