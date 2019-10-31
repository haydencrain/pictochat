import * as React from 'react';
import App from './App';
import { render, unmountComponentAtNode } from 'react-dom';

// excluding DeviceId from tests because fingerprintjs2 uses alot of browser specific APIs
// that aren't available in jsdom (too many to mock individually)
jest.mock('../../utils/DeviceId', () => {
  return {
    setDeviceIdCookie: function() {}
  };
});

describe('App.tsx', () => {
  let container = null;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  test('renders without crashing', () => {
    render(<App />, container);
  });
});
