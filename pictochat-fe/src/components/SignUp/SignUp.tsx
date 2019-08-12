import * as React from 'react';

const SignUp = () => (
  <form>
    Username: <input className="user" type="text"/>
    <br/>
    Password: <input className="pwd" type="text"/>
    <br/>
    <input className="submit" type="submit"/>
  </form>
);

export default SignUp;
