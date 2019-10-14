/// <reference types="react" />
import DropdownPair from '../../../models/DropdownPair';
import { SortValue } from '../../../models/SortTypes';
import './ThreadListMenu.less';
interface ThreadListMenuProps {
    /**
     * The text of the button that is used to create a new post
     */
    createButtonMessage: string;
    /**
     * The id of a parent post id. If supplied, the created post will be added as a reply to this post
     */
    parentId?: string;
    /**
     * The options to use within the sorting menu
     */
    sortOptions: DropdownPair<SortValue>[];
    /**
     * The currently selected sort option
     */
    activeSort: SortValue;
    /**
     * Callback function that fires when a sort is selected
     * @function
     * @param name - Name of the selected sort
     */
    onSortSelect: (name: SortValue) => void;
}
/**
 * A React component that provides Sorting and Creation functionality for Posts
 * @param { ThreadListMenuProps } props - The props of the component
 */
export default function ThreadListMenu(props: ThreadListMenuProps): JSX.Element;
export {};
