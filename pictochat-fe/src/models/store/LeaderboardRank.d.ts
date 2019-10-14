import { IUser, User } from './User';
export interface ILeaderboardRank {
    /**
     * The user details of the ranking user
     */
    user: IUser;
    /**
     * The rank that the user placed
     */
    rank: number;
    /**
     * The number of posts the user has created
     */
    postCount: number;
}
/**
 * Creates an observable instance of a Leaderboard Rank, and provides extra methods for
 * handling CRUD updates.
 */
export declare class LeaderboardRank implements ILeaderboardRank {
    user: User;
    rank: number;
    postCount: number;
    constructor(data?: {
        user: User;
        rank: number;
        postCount: number;
    });
    /**
     * Creates a new instance of LeaderboardRank from a json result
     * @function
     * @param { ILeaderboardRank } json - The basic json implementation of this class
     */
    static fromJson(json: ILeaderboardRank): LeaderboardRank;
    /**
     * Replaces this instance with a new instance of this class
     * @function
     * @param { LeaderboardRank } other - The instance to replace this instance with
     */
    replace(other: LeaderboardRank): void;
}
