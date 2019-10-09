export interface ReactionIcon {
  icon: string;
  name: string;
}

export const reactions: ReactionIcon[] = [
  { icon: '👍', name: 'thumbs-up' },
  { icon: '👎', name: 'thumbs-down' },
  { icon: '😂', name: 'laugh' },
  { icon: '😍', name: 'heart' },
  { icon: '😡', name: 'angry' }
];
