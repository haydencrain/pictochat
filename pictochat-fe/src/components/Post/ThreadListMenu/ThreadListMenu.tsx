import React from 'react';
import DropdownPair from '../../../models/DropdownPair';
import CreatePostModal from '../CreatePostModal';
import { SortValue } from '../../../models/SortTypes';
import { Menu } from 'semantic-ui-react';
import './ThreadListMenu.less';

interface ThreadListMenuProps {
  createButtonMessage: string;
  parentId?: string;
  sortOptions: DropdownPair<SortValue>[];
  activeSort: SortValue;
  onSortSelect: (name: SortValue) => void;
}

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
            />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </div>
  );
}
