import crypto from 'crypto';
import * as DateUtils from '../utils/date-utils';
import { Image } from '../models/image';
import { Transaction } from 'sequelize/types';
import config from '../utils/config';

// TEST DATA
const getRandDogUrl = () => `https://placedog.net/600?random&id=${Math.floor(Math.random() * 20) + 1}`;
const IMAGES = {
  '1': getRandDogUrl(),
  '2': getRandDogUrl(),
  '3': getRandDogUrl(),
  '4': 'https://semantic-ui.com/images/avatar2/large/elyse.png',
  '5': getRandDogUrl(),
  '6': getRandDogUrl(),
  '7': getRandDogUrl(),
  '8': getRandDogUrl(),
  '9': getRandDogUrl(),
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

  static async saveImage(newImage: NewImage, transaction?: Transaction): Promise<Image> {
    let uploadedDate: Date = new Date();
    let image: Image = Image.buildImage({ ...newImage, ...{ uploadedDate: uploadedDate } });
    return image.save({ transaction });
  }

  /**
   * @param string Unique id of the form <md5hash>-<uploadedDatetime>
   *     where uploaded datetime is in ISO format. */
  static async getImage(imageId: string): Promise<Image> {
    return await Image.getImage(imageId);
  }
}
