import React from 'react';
import { Segment, Item } from 'semantic-ui-react';
import { SockPuppetAlert } from '../../models/store/SockPuppetAlert';
import SockPuppetUser from './SockPuppetUser';

interface SockPuppetAlertProps {
  alert: SockPuppetAlert;
}

/**
 * A React component that renders the display for a sock puppet alert, and lists the users of the device
 * @component
 */
function SockPuppetItem(props: SockPuppetAlertProps) {
  const getSockPuppetUsers = () =>
    props.alert.users.map(user => {
      return <SockPuppetUser user={user} key={user.userId} />;
    });

  return (
    <Segment className="sock-puppet-alert">
      <div className="sock-puppet-alert-header">
        <div className="device-id">Device: {props.alert.deviceId}</div>
        <div className="user-count">({props.alert.users.length} Users)</div>
        <div className="device-id-type"> Device ID Type: Fingerprint </div>
      </div>
      <div className="sock-puppet-alert-content">
        <h5>Users Accessed</h5>
        <Item.Group divided>{getSockPuppetUsers()}</Item.Group>
      </div>
    </Segment>
  );
}

export default SockPuppetItem;
