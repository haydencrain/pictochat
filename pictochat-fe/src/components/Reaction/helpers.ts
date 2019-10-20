export interface ReactionIcon {
  /**
   * The emoji to use
   */
  icon: string;
  /**
   * The name of the emoji
   */
  name: string;
}

export const reactions: ReactionIcon[] = [
  { icon: '👍', name: 'thumbs-up' },
  { icon: '👎', name: 'thumbs-down' },
  { icon: '😂', name: 'laugh' },
  { icon: '😍', name: 'heart' },
  { icon: '😡', name: 'angry' }
];
