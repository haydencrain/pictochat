import { observable } from 'mobx';

export interface IPostAuthor {
  userName: string;
  userAvatarURI: string;
}

export class PostAuthor implements IPostAuthor {
  @observable userName: string;
  @observable userAvatarURI: string;
  constructor(data: IPostAuthor) {
    this.userName = data.userName;
    this.userAvatarURI = data.userAvatarURI;
  }
}
