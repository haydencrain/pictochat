import React from 'react';
import CreatePostModal from '../CreatePostModal/CreatePostModal';
import './ThreadListMenu.less';
import { Menu, Input, Dropdown } from 'semantic-ui-react';
import { SortTypes, SortValue } from '../../models/SortTypes';

interface ThreadListMenuProps {
  createButtonMessage: string;
  parentId?: string;
  activeSort: SortValue;
  onSortSelect: (name: SortValue) => void;
}

const sortOptions = [
  { name: SortTypes.NEW, title: 'Newest' },
  { name: SortTypes.COMMENTS, title: 'Most Comments' },
  { name: SortTypes.REACTIONS, title: 'Most Reactions' }
];

export default function ThreadListMenu(props: ThreadListMenuProps) {
  const sortMenuItems = sortOptions.map(option => {
    const active = props.activeSort === option.name;
    const handleClick = (e, { name }) => props.onSortSelect(name);
    return (
      <Menu.Item className="semantic-a" key={option.name} name={option.name} active={active} onClick={handleClick}>
        {option.name}
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
