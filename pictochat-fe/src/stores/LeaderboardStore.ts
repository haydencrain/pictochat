import { observable, action, IObservableArray, runInAction } from 'mobx';
import { LeaderboardRank } from '../models/store/LeaderboardRank';
import LeaderboardService from '../services/LeaderboardService';

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

export class LeaderboardStore implements ILeaderboardStore {
  @observable ranks: IObservableArray<LeaderboardRank> = observable.array(undefined, {
    name: 'leaderboardRanks'
  });
  @observable isLoading: boolean = false;

  constructor() {}

  /**
   * Fetches the leaderboard
   * @param top - The numnber of ranks to fetch
   */
  @action.bound
  async loadLeaderboard(top: number = 10) {
    this.isLoading = true;
    try {
      let ranksJson = await LeaderboardService.getLeaderboardRanks(top);
      let ranks = ranksJson.map(rankJson => LeaderboardRank.fromJson(rankJson));
      runInAction(() => this.ranks.replace(ranks));
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }
}
