import { Image } from '../models/image';
import config from '../utils/config';
import { ImageRepo } from '../repositories/image-repo';

/**
 * NOTE: IMAGES is currently used to help us expose an interface to clients
 *  that would support an user avatar image feature.
 */
const IMAGES = {
  DEFAULT_AVATAR: 'https://semantic-ui.com/images/avatar2/large/elyse.png'
};

// HELPER INTERFACES
export interface NewImage {
  data: Buffer;
  encoding: string;
}

// SERVICE

export class ImageService {
  /**
   * Resolves the imageId to a URI that clients can use to request the image
   * @param imageId
   */
  static getImageURI(imageId: string): string {
    if (IMAGES.hasOwnProperty(imageId)) {
      return IMAGES[imageId];
    }
    return `${config.API_ROOT}/image/${imageId}`;
  }

  /**
   * Get users avatar image
   * FIXME: Currently returns a mock image.
   */
  static getUserAvatarURI(userId: string): string {
    return ImageService.getImageURI('DEFAULT_AVATAR');
  }

  /**
   * Persist an image
   * @param newImage
   */
  static async saveImage(newImage: NewImage): Promise<Image> {
    let uploadedDate: Date = new Date();
    let image: Image = await ImageRepo.createImage({ ...newImage, ...{ uploadedDate: uploadedDate } });
    return image;
  }

  /**
   * @param imageId Unique id of the form <md5hash>-<uploadedDatetime>
   *     where uploaded datetime is in ISO format. */
  static async getImage(imageId: string): Promise<Image> {
    return await ImageRepo.getImage(imageId);
  }
}
