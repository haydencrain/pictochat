import { Router } from 'express';
import { Image } from '../models/image';
import { ImageService } from '../services/image-service';

const ENCODING_CONTENT_TYPES = {
  jpg: 'image/jpg'
};

export const imageRouter = Router();
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
