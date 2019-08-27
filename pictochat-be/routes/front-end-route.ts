import express from 'express';
import path from 'path';

/**
 * @param webContentDir Directory containing the files that should be served
 */
export function makeFrontEndRouter(webContentDir: string) {
  const router = express.Router();
  router.use('/', express.static(webContentDir));
  // Enable client-side routing
  // router.get('/*', (req, res) => {
  //   res.sendFile(path.join(webContentDir, 'index.html'));
  // });
  return router;
}
