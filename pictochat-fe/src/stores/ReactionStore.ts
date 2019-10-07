import { observable, action, ObservableMap, runInAction, flow } from 'mobx';
import { computedFn } from 'mobx-utils';
import { Reaction, IReaction } from '../models/Reaction';
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

  @action.bound
  async fetchPostReactions(postId: number): Promise<void> {
    let reactionJson: IReaction[] = await ReactionService.getReactionsPost(postId);
    runInAction(() => {
      let reactions = reactionJson.map(react => new Reaction(react));
      reactions.forEach((react) => this.putReact(react));
    });
  }

  @action.bound
  async updateReaction(postId: number, userId: number, reactionName: string) {
    if (!this.hasReacted(postId, userId)) {
      let reactionJson = await ReactionService.addReaction(reactionName, postId, userId);
      // console.log('NEW Reaction JSON: ', reactionJson);
      let reaction = new Reaction(reactionJson);
      this.putReact(reaction);
      return;
    }

    let reaction = this.postUserReactionsMap.get(postId).get(userId);

    if (reaction.reactionName === reactionName) {
      await ReactionService.removeReaction(reaction.reactionId);
      this.removeLocalReaction(reaction);
      return;
    }

    await ReactionService.removeReaction(reaction.reactionId);
    this.removeLocalReaction(reaction);

    reaction = new Reaction(await ReactionService.addReaction(reactionName, postId, userId));
    this.putReact(reaction);
  }

  @action.bound
  private removeLocalReaction(reaction: Reaction) {
    if (!this.postUserReactionsMap.has(reaction.postId)) throw new KeyException();
    const userReacts = this.postUserReactionsMap.get(reaction.postId);

    // Delete the map entry for this users from the post's reaction map
    if (!userReacts.has(reaction.userId)) throw new KeyException();
    userReacts.delete(reaction.userId);

    // Delete the map for the post if it has no more reactions
    if (this.postUserReactionsMap.entries().length === 0) {
      this.postUserReactionsMap.delete(reaction.postId);
    }
  }

  @action.bound
  async loadThreadReactions(discussionId: string) {
    this.isLoading = true;
    try {
      let reactsJson = await ReactionService.getDiscussionReactions(discussionId);
      // console.log('reactsJson: ', reactsJson);
      runInAction(() => {
        for (let reactJson of reactsJson) {
          let react = new Reaction(reactJson);
          // console.log('BEFORE PUT: ', JSON.stringify(this.postUserReactionsMap));
          this.putReact(react);
          // console.log('AFTER PUT: ', JSON.stringify(this.postUserReactionsMap));
        }
      });
    } finally {
      runInAction(() => this.isLoading = false);
    }
  }

  @action.bound
  putReact(react: Reaction) {
    if (this.postUserReactionsMap.has(react.postId)) {
      let userReacts = this.postUserReactionsMap.get(react.postId);
      this.putInUserReactsMap(userReacts, react);
    } else {
      let userReacts = new ObservableIntMap<Reaction>(observable.map(undefined));
      userReacts.set(react.userId, react);
      this.postUserReactionsMap.set(react.postId, userReacts);
    }
  }

  @action.bound
  putInUserReactsMap(userReacts, react) {
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

  hasReacted = computedFn(function(postId: number, userId: number) {
    if (!this.postUserReactionsMap.has(postId)) return false;
    return this.postUserReactionsMap.get(postId).has(userId);
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
