import { User } from './user';

export class LeaderboardRank {
  user: User;
  rank: number;
  // Metrics
  postCount: number;

  constructor(user, rank, postCount) {
    this.user = user;
    this.rank = rank;
    this.postCount = postCount;
  }

  toJSON(): any {
    let json = {
      user: this.user.toJSON(),
      rank: this.rank,
      postCount: this.postCount
    };
    return json;
  }

  static fromJson(json) {
    return new LeaderboardRank(json.user, json.rank, json.postCount);
  }
}
