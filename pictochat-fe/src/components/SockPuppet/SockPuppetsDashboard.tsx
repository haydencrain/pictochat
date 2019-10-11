import React from 'react';
import { observer } from 'mobx-react';
import { Segment, Loader } from 'semantic-ui-react';
import StoresContext from '../../contexts/StoresContext';
import SockPuppetItem from './SockPuppetItem';
import config from '../../config';

const { USER_LIMIT } = config.sockPuppets;

/**
 * A React component that loads all sock puppet alerts and displays them in a list
 * @component
 */
function SockPuppetsDashboard(props: {}) {
  const sockPuppetStore = React.useContext(StoresContext).sockPuppetAlerts;

  React.useEffect(() => {
    sockPuppetStore.loadAlerts(USER_LIMIT);
  }, []);

  const getContent = () => {
    if (sockPuppetStore.isLoading)
      return (
        <Segment>
          <Loader active />
        </Segment>
      );
    if (!sockPuppetStore.alerts.length) return <Segment className="bold">No suspicious devices found</Segment>;
    return sockPuppetStore.alerts.map(alert => <SockPuppetItem alert={alert} key={alert.deviceId} />);
  };

  return (
    <Segment.Group raised className="sock-puppets-dashboard">
      {getContent()}
    </Segment.Group>
  );
}

export default observer(SockPuppetsDashboard);
