import { observable, action, IObservableArray, runInAction } from 'mobx';
import { LeaderboardRank } from '../models/LeaderboardRank';
import LeaderboardService from '../services/LeaderboardService';

export class LeaderboardStore {
  @observable ranks: IObservableArray<LeaderboardRank> = observable.array(undefined, {
    name: 'leaderboardRanks'
  });
  @observable isLoading: boolean = false;

  constructor() {}

  @action.bound
  async loadLeaderboard(top: number = 10) {
    this.isLoading = true;
    try {
      let ranksJson = await LeaderboardService.getLeaderboardRanks(top);
      let ranks = ranksJson.map((rankJson) => LeaderboardRank.fromJson(rankJson));
      runInAction(() => (this.ranks.replace(ranks)));
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }
}
