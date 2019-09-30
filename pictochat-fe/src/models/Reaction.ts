export interface Reaction {
  reactionId: number;
  reactionName: string;
  postId: number;
  userId: number;
}

export class Reaction implements Reaction {
  reactionId: number;
  reactionName: string;
  postId: number;
  userId: number;

  constructor(data?: Reaction) {
    if (data) {
      this.reactionId = data.reactionId;
      this.reactionName = data.reactionName;
      this.postId = data.postId;
      this.userId = data.userId;
    }
  }

  replace(other: Reaction) {
    this.reactionId = other.reactionId;
    this.reactionName = other.reactionName;
    this.postId = other.postId;
    this.userId = other.userId;
  }
  clear() {
    this.replace(new Reaction());
  }
}

export default Reaction;
