import { observable, action } from 'mobx';
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

  /**
   * Creates a new instance of LeaderboardRank from a json result
   * @function
   * @param { ILeaderboardRank } json - The basic json implementation of this class
   */
  static fromJson(json: ILeaderboardRank) {
    return new LeaderboardRank({
      user: new User(json.user),
      rank: json.rank,
      postCount: json.postCount
    });
  }

  /**
   * Replaces this instance with a new instance of this class
   * @function
   * @param { LeaderboardRank } other - The instance to replace this instance with
   */
  @action.bound
  replace(other: LeaderboardRank) {
    this.user = other.user;
    this.rank = other.rank;
    this.postCount = other.postCount;
  }
}
