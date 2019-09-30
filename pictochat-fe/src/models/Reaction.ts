import { observable, action } from 'mobx';
import { useAsObservableSource } from 'mobx-react';

export interface IReaction {
  reactionId: number;
  reactionName: string;
  postId: number;
  userId: number;
}

export class Reaction implements IReaction {
  @observable reactionId: number;
  @observable reactionName: string;
  @observable postId: number;
  @observable userId: number;

  constructor(data?: IReaction) {
    if (data) {
      this.reactionId = data.reactionId;
      this.reactionName = data.reactionName;
      this.postId = data.postId;
      this.userId = data.userId;
    }
  }

  @action.bound
  replace(other: Reaction) {
    this.reactionId = other.reactionId;
    this.reactionName = other.reactionName;
    this.postId = other.postId;
    this.userId = other.userId;
  }

  @action.bound
  clear() {
    this.replace(new Reaction());
  }
}

export default Reaction;
