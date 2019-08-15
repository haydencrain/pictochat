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

interface IProps { }

const Test = (props: TestProps) => (
  <div className="test">
    <h1>{props.header}</h1>
    <img src={duck} />
  </div>
);

class App extends React.Component<IProps, IState> {
  static readonly API_ROOT: string = process.env.PICTOCHAT_API_ROOT;

  constructor(props: IProps) {
    super(props as any);
    this.state = { apiResponse: "" };
  }

  private callApi() {
    fetch(App.API_ROOT + '/test')
      .then(res => res.text())
      .then(res => this.setState({ apiResponse: res }))
      .catch(err => err);
  }

  componentDidMount() {
    this.callApi();
  }

  render() {
    return (
      <div className="app">
        <Test header="Hello World!" />
        <SignUp />
        <br />
        <p>{this.state.apiResponse}</p>
      </div>
    );
  }
}



export default App;
