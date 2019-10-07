export type SortValue = 'new' | 'comments' | 'reactions' | '';

export const SortTypes: { [key: string]: SortValue } = {
  NEW: 'new',
  COMMENTS: 'comments',
  REACTIONS: 'reactions',
  NONE: ''
};
