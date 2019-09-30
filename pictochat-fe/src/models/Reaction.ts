import { observable, action } from 'mobx';
import { useAsObservableSource } from 'mobx-react';

export interface IReaction {
  postId: number;
  userId: number;
  reactionId: number;
}

export class Reaction implements IReaction {
  @observable postId: number;
  @observable userId: number;
  @observable reactionId: number;

  constructor(data?: IReaction) {
    if (data) {
      this.postId = data.postId;
      this.userId = data.userId;
      this.reactionId = data.reactionId;
    }
  }

  @action.bound
  replace(other: Reaction) {
    this.postId = other.postId;
    this.userId = other.userId;
    this.reactionId = other.reactionId;
  }

  @action.bound
  clear() {
    this.replace(new Reaction());
  }
}

export default Reaction;
