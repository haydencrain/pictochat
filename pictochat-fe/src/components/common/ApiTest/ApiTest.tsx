import * as React from 'react';
import duck from '../../images/duck.jpg';
import SignUp from '../SignUp/SignUp';

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

const API_ROOT = process.env.PICTOCHAT_API_ROOT;

export default class ApiTest extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props as any);
    this.state = { apiResponse: '' };
  }

  private callApi() {
    fetch(API_ROOT + '/test')
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
