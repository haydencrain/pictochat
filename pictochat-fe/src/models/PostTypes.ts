export enum PostTypes {
  Root,
  Main,
  Reply
}

/**
 * Converts a PostType enum value into its string counterpart
 * @function
 * @param { enum } postType - The enum to convert
 * @returns The string representative of the post type `'main' | 'root' | 'reply' | ''`
 */
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
