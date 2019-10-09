import { observable, action } from 'mobx';
import { IUser, User } from './User';

export interface ILeaderboardRank {
  user: IUser;
  rank: number;
  postCount: number;
}

export class LeaderboardRank implements ILeaderboardRank {
  @observable user: User;
  @observable rank: number;
  @observable postCount: number;

  constructor(data?: { user: User; rank: number; postCount: number }) {
    if (!!data) {
      this.user = data.user;
      this.rank = data.rank;
      this.postCount = data.postCount;
    }
  }

  static fromJson(json: ILeaderboardRank) {
    return new LeaderboardRank({
      user: new User(json.user),
      rank: json.rank,
      postCount: json.postCount
    });
  }

  @action.bound
  replace(other: LeaderboardRank) {
    this.user = other.user;
    this.rank = other.rank;
    this.postCount = other.postCount;
  }
}
