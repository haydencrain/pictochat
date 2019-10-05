import * as React from 'react';
import { IUser } from '../../models/User';
import ApiService from '../../services/ApiService';
import { Loader, Item, Label, Button, Segment } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import './SockPuppetsDashboardPage.less';

const USER_LIMIT = 2;

interface PageProps extends RouteComponentProps<any> {}

interface ISockPuppetAlert {
  deviceId: string;
  users: IUser[];
}

export function SockPuppetsDashboardPage(props: PageProps) {
  const [alerts, isLoading] = useFetchSockPuppetAlerts([props.location]);
  let content;
  if (isLoading) {
    content = <Loader />;
  } else {
    content = <SockPuppertsDashboard alerts={alerts} />;
  }

  return <section id="sock-puppet-dashboard-page">{content}</section>;
}

export default observer(SockPuppetsDashboardPage);

//// HOOKS ////

function useFetchSockPuppetAlerts(dependencies: any[]): [ISockPuppetAlert[], boolean] {
  const [alerts, setAlerts] = React.useState<ISockPuppetAlert[]>();
  const [isLoading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    setLoading(true);
    ApiService.get('/sock-puppet-alert', { userLimit: USER_LIMIT })
      .then((alerts: ISockPuppetAlert[]) => {
        setAlerts(alerts);
      })
      .catch(error => {
        console.error('Error encountered during sock puppet alert fetch: ', error);
      })
      .finally(() => setLoading(false));
  }, dependencies);

  return [alerts, isLoading];
}

//// INNER COMPONENTS ////

function SockPuppertsDashboard(props: { alerts: ISockPuppetAlert[] }) {
  return (
    <Segment className="sock-puppets-dashboard">
      <h1>Sock Puppets</h1>
      <div>
        This page contains a list of devices that have been used to access more than {USER_LIMIT} users/accounts.
      </div>
      {props.alerts.map(alert => (
        <SockPuppetAlert alert={alert} key={alert.deviceId} />
      ))}
    </Segment>
  );
}

function SockPuppetAlert(props: { alert: ISockPuppetAlert }) {
  return (
    <Segment className="sock-puppet-alert">
      <div className="sock-puppet-alert-header">
        <div className="device-id">Device: {props.alert.deviceId}</div>
        <div className="user-count">({props.alert.users.length} Users)</div>
        <div className="device-id-type"> Device ID Type: Fingerprint </div>
      </div>
      <div className="sock-puppet-alert-content">
        <h5>Users Accessed</h5>
        <Item.Group divided>
          {props.alert.users.map(user => (
            <UserView user={user} key={user.userId} />
          ))}
        </Item.Group>
      </div>
    </Segment>
  );
}

function UserView(props: { user: IUser }) {
  /*<div className="user-view">
      <Label>
        Username:
        <Label.Detail>{props.user.username}</Label.Detail>
      </Label>
  </div>*/
  return (
    <Item>
      <Item.Header> User: {props.user.username}</Item.Header>
      <Item.Description>User Id: {props.user.userId}</Item.Description>
      <Item.Extra>
        <Button floated="right">Disable User</Button>
      </Item.Extra>
    </Item>
  );
}
