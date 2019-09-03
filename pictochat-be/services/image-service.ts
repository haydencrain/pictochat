import path from 'path';

const getRandDogUrl = () => `https://placedog.net/600?random&id=${Math.floor(Math.random() * 20) + 1}`;

const WEB_CONTENT_DIR = process.env.PICTOCHAT_FRONTEND_DIR || path.join(__dirname, '../pictochat-fe');
const IMAGES = {
  '1': getRandDogUrl(),
  '2': getRandDogUrl(),
  '3': getRandDogUrl(),
  '4': 'https://semantic-ui.com/images/avatar2/large/elyse.png',
  '5': getRandDogUrl(),
  '6': getRandDogUrl(),
  '7': getRandDogUrl(),
  '8': getRandDogUrl(),
  '9': getRandDogUrl()
};

/**
 * NOTE: This currently just returns mock data
 */
export class ImageService {
  static getImageURI(imageId: string): string {
    return IMAGES[imageId];
  }

  static getUserAvatarURI(imageId: string): string {
    return ImageService.getImageURI(imageId);
  }
}
