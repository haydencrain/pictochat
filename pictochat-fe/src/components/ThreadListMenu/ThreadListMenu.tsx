import React from 'react';
import CreatePostModal from '../CreatePostModal/CreatePostModal';
import './ThreadListMenu.less';
import { Menu, Input, Dropdown } from 'semantic-ui-react';

interface ThreadListMenuProps {
  header: string;
  createButtonMessage: string;
  parentId?: string;
}

const sortOptions = [
  { name: 'new', title: 'Newest' },
  { name: 'comments', title: 'Most Comments' },
  { name: 'reactions', title: 'Most Reactions' }
];

export default function ThreadListMenu(props: ThreadListMenuProps) {
  const [sort, setSort] = React.useState('new');

  const sortMenuItems = sortOptions.map(option => {
    const active = sort === option.name;
    const handleClick = (e, { name }) => setSort(name);
    return (
      <Menu.Item className="semantic-a" key={option.name} name={option.name} active={active} onClick={handleClick}>
        {option.name}
      </Menu.Item>
    );
  });

  return (
    <div className="thread-list-menu">
      <h1>{props.header}</h1>
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
