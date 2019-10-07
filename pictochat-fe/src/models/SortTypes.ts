export type SortValue = 'new' | 'comments' | 'reactions' | '';

export const SortTypes = {
  NEW: 'new' as SortValue,
  COMMENTS: 'comments' as SortValue,
  REACTIONS: 'reactions' as SortValue,
  NONE: '' as SortValue
};
