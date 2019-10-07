import * as React from 'react';
import User from '../../models/User';
import { Loader, Item, Button, Segment } from 'semantic-ui-react';
import { observer, Observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import './SockPuppetsDashboardPage.less';
import StoresContext from '../../contexts/StoresContext';
import { SockPuppetAlert } from '../../models/SockPuppetAlert';
import { computed } from 'mobx';

const USER_LIMIT = 2;

interface PageProps extends RouteComponentProps<any> {}

export function SockPuppetsDashboardPage(props: PageProps) {
  const stores = React.useContext(StoresContext);

  const canViewPage = computed(() => stores.user.isLoggedIn && stores.user.currentUser.hasAdminRole);

  useFetchSockPuppetAlerts([props.location]);

  let content;
  if (!canViewPage.get()) {
    content = 'You are unauthorised to view this page';
  } else if (stores.sockPuppetAlerts.isLoading) {
    content = <Loader active />;
  } else {
    content = <SockPuppertsDashboard alerts={stores.sockPuppetAlerts.alerts} />;
  }

  return <section id="sock-puppet-dashboard-page">{content}</section>;
}

export default observer(SockPuppetsDashboardPage);

//// HOOKS ////

function useFetchSockPuppetAlerts(dependencies: any[]) {
  const store = React.useContext(StoresContext).sockPuppetAlerts;
  React.useEffect(() => {
    store.loadAlerts(USER_LIMIT);
  }, dependencies);
}

//// INNER COMPONENTS ////

const SockPuppertsDashboard = observer(function SockPuppertsDashboard(props: { alerts: SockPuppetAlert[] }) {
  const alertViews = props.alerts.map(alert => <SockPuppetAlertView alert={alert} key={alert.deviceId} />);
  const placeholder = <Segment className="bold">No suspicious devices found</Segment>;
  const content = props.alerts.length > 0 ? alertViews : placeholder;

  return (
    <>
      <h1>Sock Puppets</h1>
      <p>This page contains a list of devices that have been used to access more than {USER_LIMIT} users/accounts.</p>
      <Segment.Group raised className="sock-puppets-dashboard">
        {content}
      </Segment.Group>
    </>
  );
});

const SockPuppetAlertView = observer(function SockPuppetAlert(props: { alert: SockPuppetAlert }) {
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
          {props.alert.users.map(user => {
            //@ts-ignore
            return <UserView user={user} key={user.userId} />;
          })}
        </Item.Group>
      </div>
    </Segment>
  );
});

const UserView = observer(function UserView(props: { user: User }) {
  const stores = React.useContext(StoresContext);
  const user = () => props.user;
  const handleDisableUser = async () => {
    try {
      await stores.user.disableUser(props.user);
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
});
