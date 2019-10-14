import { IObservableArray } from 'mobx';
import { LeaderboardRank } from '../models/store/LeaderboardRank';
interface ILeaderboardStore {
    /**
     * Stores the array of ranks
     */
    ranks: IObservableArray<LeaderboardRank>;
    /**
     * Set to true if the store is currently fetching the leaderboard
     */
    isLoading: boolean;
}
export declare class LeaderboardStore implements ILeaderboardStore {
    ranks: IObservableArray<LeaderboardRank>;
    isLoading: boolean;
    constructor();
    /**
     * Fetches the leaderboard
     * @param top - The numnber of ranks to fetch
     */
    loadLeaderboard(top?: number): Promise<void>;
}
export {};
