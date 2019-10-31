import React from 'react';
import DropdownPair from '../../../models/DropdownPair';
import CreatePostModal from '../CreatePostModal';
import { SortValue } from '../../../models/SortTypes';
import { Menu } from 'semantic-ui-react';
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
export default function ThreadListMenu(props: ThreadListMenuProps) {
  const sortMenuItems = props.sortOptions.map(option => {
    const active = props.activeSort === option.value;
    const handleClick = (e, { name }) => props.onSortSelect(name);
    return (
      <Menu.Item className="semantic-a" key={option.value} name={option.value} active={active} onClick={handleClick}>
        {option.title}
      </Menu.Item>
    );
  });

  return (
    <div className="thread-list-menu">
      <Menu text>
        <Menu.Item header>Sort By</Menu.Item>
        {sortMenuItems}
        <Menu.Menu position="right">
          <Menu.Item>
            <CreatePostModal
              triggerType="button"
              triggerContent={props.createButtonMessage}
              parentPostId={props.parentId}
              triggerClassName={'add-reply-trigger'}
            />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </div>
  );
}
