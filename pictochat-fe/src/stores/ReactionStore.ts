import { observable, action, ObservableMap, runInAction } from 'mobx';
import { computedFn } from 'mobx-utils';
import { Reaction } from '../models/Reaction';
import ObservableIntMap from '../utils/ObserableIntMap';
import ReactionService from '../services/ReactionService';

// export class PostReactions {
//   @observable hasCurrentUser: boolean;
//   @observable currentUserReaction: Reaction;
//   // Has format {[reactionName]: count}
//   @observable reactionCountMap: ObservableMap<any, number> = observable.map(undefined, {
//     name: 'reactionCountMap'
//   });
// }

export class KeyException {
  static readonly ERROR_TYPE = 'KEY_ERROR';
  errorType: string;
  message: string;
  constructor(message?: string) {
    this.message = message;
    this.errorType = KeyException.ERROR_TYPE;
  }
}

export class ReactionStore {
  @observable isLoading: boolean;
  // {post: {reactionId: Reaction}}
  // @observable postReactionsMap: ObservableMap<any, ObservableMap<any, Reaction>> = observable.map(undefined);

  // @observable reactionMap: ObservableIntMap<Reaction> = new ObservableIntMap(observable.map(undefined));

  // {post: {user: Reaction}}
  @observable
  postUserReactionsMap: ObservableIntMap<ObservableIntMap<Reaction>> = new ObservableIntMap(observable.map(undefined));

  @action
  async loadThreadReactions(discussionId: string) {
    this.isLoading = true;
    try {
      let reactsJson = await ReactionService.getDiscussionReactions(discussionId);
      for (let reactJson of reactsJson) {
        this.putReact(new Reaction(reactJson));
      }
    } finally {
      runInAction(() => this.isLoading = false);
    }
  }

  @action putReact(react: Reaction) {
    if (this.postUserReactionsMap.has(react.postId)) {
      let userReacts = this.postUserReactionsMap.get(react.postId);
      this.putInUserReactsMap(userReacts, react);
    } else {
      let userReacts = new ObservableIntMap<Reaction>(observable.map(undefined));
      userReacts.set(react.userId, react);
      this.postUserReactionsMap.set(react.postId, userReacts);
    }
  }

  @action putInUserReactsMap(userReacts, react) {
    if (userReacts.has(react.userId)) {
      userReacts.get(react.userId).replace(react);
    } else {
      userReacts.set(react.userId, react);
    }
  }

  userReactionForPost = computedFn(function(postId: number, userId: number) {
    if (!this.postUserReactionsMap.has(postId)) throw new KeyException();

    let userReacts = this.postUserReactionsMap.get(postId);
    if (!userReacts.has(userId)) throw new KeyException();

    return userReacts.get(userId);
  });

  // number of reactions by name of specified post
  postReactionNameCounts = computedFn(function(postId: number) {
    let nameCounts = {};
    let postReactions: Reaction[] = this.postReactions(postId);
    for (let reaction of postReactions) {
      let name = reaction.reactionName;
      if (!nameCounts[name]) {
        nameCounts[name] = 0;
      }
      nameCounts[name]++;
    }
    return nameCounts;
  });

  // get an array of Reaction objects for specified post
  postReactions = computedFn(function(postId: number) {
    if (!this.postUserReactionsMap.has(postId)) {
      return [];
    }
    let userReactionsMap: ObservableIntMap<Reaction> = this.postUserReactionsMap.get(postId);
    return Array.from(userReactionsMap.values());
  });
}
