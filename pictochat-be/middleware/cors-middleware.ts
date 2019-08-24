
export function makeCORSMiddleware(allowedRequestOrigin: string) {
  return (req, res, next) => {
    res.header('Access-Control-Allow-Origin', allowedRequestOrigin);
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    // FIXME: Typescript complains that res.header only takes 2 args
    // @ts-ignore
    res.header('Access-Control-Allow-Headers', 'Content-Type', 'Authorization');

    if (req.method.toUpperCase() == "OPTIONS") {
      res.status(200).send();
      return;
    }
    next();
  };
}
