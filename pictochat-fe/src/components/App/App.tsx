import * as React from 'react';
import duck from '../../images/duck.jpg';
import './App.less';

interface TestProps {
  header: string;
}

const Test = (props: TestProps) => (
  <div className="test">
    <h1>{props.header}</h1>
    <img src={duck} />
  </div>
);

const App = () => (
  <div className="app">
    <Test header="Hello World!" />
  </div>
);

export default App;
