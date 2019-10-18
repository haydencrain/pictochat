import express from 'express';
import expressStaticGzip from 'express-static-gzip';

/**
 * @param webContentDir Directory containing the files that should be served
 */
export function makeFrontEndRouter(webContentDir: string) {
  const router = express.Router();
  router.use(
    '/',
    expressStaticGzip(webContentDir, {
      enableBrotli: true,
      orderPreference: ['br', 'gz'],
      serveStatic: {
        maxAge: 234, // will be kept
        cacheControl: false // will be kept as well
      }
    })
  );
  return router;
}
