import * as React from 'react';
import duck from '../../images/duck.jpg';
import SignUp from '../SignUp/SignUp';
import './App.less';

interface TestProps {
  header: string;
}

interface IState {
  apiResponse: string;
}

interface IProps {}

const Test = (props: TestProps) => (
  <div className="test">
    <h1>{props.header}</h1>
    <img src={duck} />
  </div>
);

class App extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props as any);
    this.state = {apiResponse: ""};
  }

  callApi(){
    fetch("http://192.168.99.100:9000/testAPI")
      .then(res => res.text())
      .then(res => this.setState({apiResponse: res}))
      .catch(err => err);
  }

  componentDidMount() {
    this.callApi();
  }

  render() {
    return (
      <div className="app">
        <Test header="Hello World!"/>
        <SignUp />
        <br/>
        <p>{this.state.apiResponse}</p>
      </div>
    );
  }
}



export default App;
