import { observable } from 'mobx';

export interface IReaction {
  /**
   * The id of the reaction
   */
  reactionId: number;
  /**
   * the name of the reaction (aka reaction type)
   */
  reactionName: string;
  /**
   * the id of the post it was added to
   */
  postId: number;
  /**
   * the id of the user who created the reaction
   */
  userId: number;
}

/**
 * Creates an observable instance of Reaction.
 * @class
 */
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

  /**
   * Replaces the current instance of reaction with another instance
   * @param { Reaction } other - The other instance to replace this Reaction with
   */
  replace(other: Reaction) {
    this.reactionId = other.reactionId;
    this.reactionName = other.reactionName;
    this.postId = other.postId;
    this.userId = other.userId;
  }

  /**
   * Replaces this instance's post with an empty reaction
   * @function
   */
  clear() {
    this.replace(new Reaction());
  }
}

export default Reaction;
