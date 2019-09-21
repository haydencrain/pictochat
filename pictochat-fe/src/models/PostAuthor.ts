import { observable } from 'mobx';

export interface IPostAuthor {
  username: string;
  userAvatarURI: string;
}

export class PostAuthor implements IPostAuthor {
  @observable username: string;
  @observable userAvatarURI: string;
  constructor(data: IPostAuthor) {
    this.username = data.username;
    this.userAvatarURI = data.userAvatarURI;
  }
}
