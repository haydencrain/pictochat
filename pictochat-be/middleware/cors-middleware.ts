/**
 * Allow requests on the same IP address to a different port
 * @param allowedRequestOrigin
 */
export function makeCORSMiddleware(allowedRequestOrigin: string) {
  return (req, res, next) => {
    res.header('Access-Control-Allow-Origin', allowedRequestOrigin);
    res.header('Access-Control-Allow-Methods', 'GET, PUT, PATCH, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'content-type, Authorization, x-device-id');

    if (req.method.toUpperCase() == 'OPTIONS') {
      res.status(200).send();
      return;
    }
    next();
  };
}
