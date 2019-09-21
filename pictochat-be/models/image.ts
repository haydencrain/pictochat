import crypto from 'crypto';
import * as DateUtils from '../utils/date-utils';
import { Sequelize, Model, DataTypes, Op, FindOptions } from 'sequelize';
import { SequelizeConnectionService } from '../services/sequelize-connection-service';


const sequelize: Sequelize = SequelizeConnectionService.getInstance();

export class Image extends Model {
  static readonly PUBLIC_ATTRIBUTES = ['imageId', 'data', 'encoding', 'uploadedDate'];
  _id: number; // TODO: Not sure if we need this
  imageId: string; // md5hash + uploadDate
  data: Buffer;
  encoding: string;
  uploadedDate: Date;

  // INSTANCE METHODS

  /**
   * Calculates a unique identifier based on the content of the image and current time */
  computeImageId(): string {
    let hash: string = crypto.createHash('md5').update(this.getDataValue('data')).digest('hex');
    let timestamp: string = DateUtils.timestamp(this.getDataValue('uploadedDate'));
    return `${hash}-${timestamp}`;
  }

  // STATIC/COLLECTION METHODS

  static async getImage(imageId: string, options: FindOptions = {}): Promise<Image> {
    options = { attributes: Image.PUBLIC_ATTRIBUTES, ...options };
    options['where'] = { ...(options['where'] || {}), imageId };
    return await Image.findOne(options);
  }

  /**
   * Create a new image without persisting it. */
  static buildImage(attrs: { data: Buffer, encoding: string, uploadedDate: Date }): Image {
    let image: Image = Image.build(attrs);
    image.setDataValue('imageId', image.computeImageId());
    return image;
  }
}

Image.init(
  {
    _id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    imageId: { type: DataTypes.STRING, unique: true },
    data: { type: DataTypes.BLOB('long') },
    encoding: { type: DataTypes.STRING },
    uploadedDate: { type: DataTypes.DATE }
  },
  {
    sequelize: sequelize,
    modelName: 'image',
    tableName: 'images',
    underscored: false
  }
);
