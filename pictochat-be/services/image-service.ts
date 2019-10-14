import { Image } from '../models/image';
import config from '../utils/config';
import { ImageRepo } from '../repositories/image-repo';

const IMAGES = {
  DEFAULT_AVATAR: 'https://semantic-ui.com/images/avatar2/large/elyse.png'
};

// HELPER INTERFACES

export interface NewImage {
  data: Buffer;
  encoding: string;
}

// SERVICE

/**
 * NOTE: This currently just returns mock data
 */
export class ImageService {

  static getImageURI(imageId: string): string {
    if (IMAGES.hasOwnProperty(imageId)) {
      return IMAGES[imageId];
    }
    return `${config.API_ROOT}/image/${imageId}`;
  }

  static getUserAvatarURI(imageId: string): string {
    return ImageService.getImageURI(imageId);
  }

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
