import crypto from 'crypto';
import * as DateUtils from '../utils/date-utils';
import { Sequelize, Model, DataTypes, Op } from 'sequelize';
import { SequelizeConnectionService } from '../services/sequelize-connection-service';


const sequelize: Sequelize = SequelizeConnectionService.getInstance();

export class Image extends Model {
  _id: number; // TODO: Not sure if we need this
  imageId: string; // md5hash + uploadDate
  data: Buffer;
  encoding: string;
  uploadedDate: Date;

  /**
   * Calculates a unique identifier based on the content of the image and current time
   */
  computeImageId(): string {
    let hash: string = crypto.createHash('md5').update(this.getDataValue('data')).digest('hex');
    let timestamp: string = DateUtils.timestamp(this.getDataValue('uploadedDate'));
    return `${hash}-${timestamp}`;
  }

  static buildImage(attrs: {data: Buffer, encoding: string, uploadedDate: Date}): Image {
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
