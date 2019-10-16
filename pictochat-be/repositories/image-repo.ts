import { Image } from '../models/image';

export class ImageRepo {

  static async getImage(imageId: string): Promise<Image> {
    const options = {
      attributes: Image.PUBLIC_ATTRIBUTES,
      where: { imageId }
    };
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
