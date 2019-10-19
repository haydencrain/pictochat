import { Router } from 'express';
import { Image } from '../models/image';
import { ImageService } from '../services/image-service';
import { ENCODING_CONTENT_TYPES } from '../utils/encoding-content-types';

/**
 * Implements HTTP responses for the endpoint `'/api/image`
 */
export const imageRouter = Router();

/**
 * GET an image
 * @urlParam imageId
 */
imageRouter.get('/:imageId', async (req, res, next) => {
  try {
    let image: Image = await ImageService.getImage(req.params.imageId);

    // Images are idempotent so tell client to cache for a long time (7 days)
    res.set('Cache-Control', 'max-age=1209600, no-transform');

    res.type(ENCODING_CONTENT_TYPES[image.encoding]);
    res.send(image.data);
  } catch (error) {
    next(error);
  }
});
