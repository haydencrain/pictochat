import DropdownPair from '../../../models/DropdownPair';
import { SortValue, SortTypes } from '../../../models/SortTypes';

export const threadSummarySortOptions: DropdownPair<SortValue>[] = [
  { value: SortTypes.NEW, title: 'Newest' },
  { value: SortTypes.REACTIONS, title: 'Most Reactions' },
  { value: SortTypes.COMMENTS, title: 'Most Comments' }
];

export const repliesSortOptions: DropdownPair<SortValue>[] = [
  { value: SortTypes.NEW, title: 'Newest' },
  { value: SortTypes.REACTIONS, title: 'Most Reactions' }
];
