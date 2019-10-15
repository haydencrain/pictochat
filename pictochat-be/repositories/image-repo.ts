import { Image } from '../models/image';
import { FindOptions } from 'sequelize';

export class ImageRepo {

  static async getImage(imageId: string, options: FindOptions = {}): Promise<Image> {
    options = { attributes: Image.PUBLIC_ATTRIBUTES, ...options };
    options['where'] = { ...(options['where'] || {}), imageId };
    return await Image.findOne(options);
  }

  /**
   * Create a new image without persisting it. */
  static async createImage(attrs: { data: Buffer, encoding: string, uploadedDate: Date }): Promise<Image> {
    let image: Image = Image.build(attrs);
    image.imageId = image.computeImageId();
    await image.save();
    return image;
  }
}
