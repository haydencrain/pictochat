export enum PostTypes {
  Root,
  Main,
  Reply
}

export function getPostTypeName(postType: PostTypes) {
  switch (postType) {
    case PostTypes.Main:
      return 'main';

    case PostTypes.Root:
      return 'root';

    case PostTypes.Reply:
      return 'reply';

    default:
      return '';
  }
}
