import * as fingerprint from 'fingerprintjs2';
import * as cookies from 'js-cookie';

export const DEVICE_ID_COOKIE_NAME = 'deviceId';

export async function getDeviceId() {
  const components = await fingerprint.getPromise();
  // Adapted from: https://github.com/Valve/fingerprintjs2#get-and-getpromise
  const values = components.map(component => component.value);
  return fingerprint.x64hash128(values.join(''), 31);
}

export async function setDeviceIdCookie() {
  const deviceId = await getDeviceId();
  cookies.set(DEVICE_ID_COOKIE_NAME, deviceId);
}
