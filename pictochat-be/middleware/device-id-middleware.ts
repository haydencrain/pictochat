/**
 * Use this to parse the clients device id from the request
 * and store it in req.deviceId */
export async function deviceIdMiddleware(req, res, next) {
  req.deviceId = req.headers['x-device-id'];
  next();
}
