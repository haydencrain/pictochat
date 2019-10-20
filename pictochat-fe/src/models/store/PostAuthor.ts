import { observable } from 'mobx';

export interface IPostAuthor {
  /**
   * The author's username
   */
  username: string;
  /**
   * the URI of the user's avatar
   */
  userAvatarURI: string;
}

/**
 * Creates an observable instance of Post Author
 * @class
 */
export class PostAuthor implements IPostAuthor {
  @observable username: string;
  @observable userAvatarURI: string;

  constructor(data: IPostAuthor) {
    this.username = data.username;
    this.userAvatarURI = data.userAvatarURI;
  }
}
