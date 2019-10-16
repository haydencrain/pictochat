import express from 'express';

/**
 * @param webContentDir Directory containing the files that should be served
 */
export function makeFrontEndRouter(webContentDir: string) {
  const router = express.Router();
  router.use('/', express.static(webContentDir));
  return router;
}
