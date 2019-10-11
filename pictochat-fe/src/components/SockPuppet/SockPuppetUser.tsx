import React from 'react';
import { Observer, observer } from 'mobx-react';
import { Item, Button } from 'semantic-ui-react';
import StoresContext from '../../contexts/StoresContext';
import User from '../../models/store/User';

interface SockPuppetUserProps {
  /**
   * The suspicious user
   */
  user: User;
}

/**
 * A React component that displays details of the suspicious user, with a button to be able to disable their account
 * @component
 */
function SockPuppetUser(props: SockPuppetUserProps) {
  const userStore = React.useContext(StoresContext).user;
  const user = () => props.user;

  const handleDisableUser = () => {
    try {
      userStore.disableUser(props.user);
    } catch (error) {
      if (error.status && error.status === 404) {
        alert("This user either doesn't exist or is already disabled");
        return;
      }
      throw error;
    }
  };

  return (
    <Item>
      <Item.Header> User: {user().username}</Item.Header>
      <Item.Description>User Id: {user().userId}</Item.Description>
      <Item.Extra>
        <Observer>
          {() => {
            return (
              <Button floated="right" disabled={user().isDisabled} onClick={handleDisableUser}>
                Disable User
              </Button>
            );
          }}
        </Observer>
      </Item.Extra>
    </Item>
  );
}

export default observer(SockPuppetUser);
