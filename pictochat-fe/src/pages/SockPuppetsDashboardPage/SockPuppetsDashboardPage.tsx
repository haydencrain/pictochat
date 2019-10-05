import * as React from 'react';
import User, { IUser } from '../../models/User';
import ApiService from '../../services/ApiService';
import { Loader, Item, Label, Button, Segment } from 'semantic-ui-react';
import { observer, Observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import './SockPuppetsDashboardPage.less';
import StoresContext from '../../contexts/StoresContext';
import { ISockPuppetAlert, SockPuppetAlert } from '../../models/SockPuppetAlert';
import { trace, runInAction } from 'mobx';

const USER_LIMIT = 2;

interface PageProps extends RouteComponentProps<any> {}

export function SockPuppetsDashboardPage(props: PageProps) {
  const stores = React.useContext(StoresContext);
  // const [alerts, isLoading, shouldReFetch, setShouldReFetch] = useFetchSockPuppetAlerts([props.location]);
  const handleDisableUser = () => {};

  useFetchSockPuppetAlerts([props.location]);

  let content;
  if (stores.sockPuppetAlerts.isLoading) {
    content = <Loader />;
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

// function useFetchSockPuppetAlerts(
//   dependencies: any[]
// ): [ISockPuppetAlert[], boolean, boolean, React.Dispatch<React.SetStateAction<boolean>>] {
//   const [alerts, setAlerts] = React.useState<ISockPuppetAlert[]>();
//   const [isLoading, setLoading] = React.useState<boolean>(true);
//   const [shouldReFetch, setShouldReFetch] = React.useState<boolean>(false);
//   const store = React.useContext(StoresContext).user;

//   React.useEffect(() => {
//     setLoading(true);
//     ApiService.get('/sock-puppet-alert', { userLimit: USER_LIMIT })
//       .then((alerts: ISockPuppetAlert[]) => {
//         // FIXME: Do this in a sock-puppet alert store
//         alerts.forEach(alert => {});
//         setAlerts(alerts);
//       })
//       .catch(error => {
//         console.error('Error encountered during sock puppet alert fetch: ', error);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, [shouldReFetch, ...dependencies]);

//   return [alerts, isLoading, shouldReFetch, setShouldReFetch];
// }

//// INNER COMPONENTS ////

const SockPuppertsDashboard = observer(function SockPuppertsDashboard(props: { alerts: SockPuppetAlert[] }) {
  return (
    <Segment className="sock-puppets-dashboard">
      <h1>Sock Puppets</h1>
      <div>
        This page contains a list of devices that have been used to access more than {USER_LIMIT} users/accounts.
      </div>
      {props.alerts.map(alert => (
        <SockPuppetAlertView alert={alert} key={alert.deviceId} />
      ))}
    </Segment>
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
  const user = () => {
    return props.user;
    // return store.userMap.get(props.user.username);
  };
  const handleDisableUser = async () => {
    try {
      await stores.user.disableUser(props.user);
      // await stores.sockPuppetAlerts.loadAlerts(USER_LIMIT);
    } catch (error) {
      if (error.status && error.status === 404) {
        alert("This user either doesn't exist or is already disabled");
        return;
      }
      throw error;
    }
  };
  trace();
  console.log('RENDER UserView');
  // // Use the store's copy of the user so we don't have to
  // // something silly like window.refresh to update other UserView instances for the same user
  // // when the disable button is pressed
  // const user = () => store.userMap.get(props.user.username);
  // if (!store.hasUser(props.user.username)) {
  //   return null;
  // }
  return (
    <Item>
      <Item.Header> User: {user().username}</Item.Header>
      <Item.Description>User Id: {user().userId}</Item.Description>
      <Item.Extra>
        <Observer>
          {() => {
            trace();
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
