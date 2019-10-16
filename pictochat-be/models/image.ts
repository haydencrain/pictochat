import crypto from 'crypto';
import * as DateUtils from '../utils/date-utils';
import { Sequelize, Model, DataTypes, Op, FindOptions } from 'sequelize';
import { SequelizeConnection } from '../utils/sequelize-connection';


const sequelize: Sequelize = SequelizeConnection.getInstance();

export class Image extends Model {
  static readonly PUBLIC_ATTRIBUTES = ['imageId', 'data', 'encoding', 'uploadedDate'];
  imageId: string; // md5hash + uploadDate
  data: Buffer;
  encoding: string;
  uploadedDate: Date;

  /**
   * Calculates a unique identifier based on the content of the image and current time */
  computeImageId(): string {
    let hash: string = crypto.createHash('md5').update(this.data).digest('hex');
    let timestamp: string = DateUtils.timestamp(this.uploadedDate);
    return `${hash}-${timestamp}`;
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
    underscored: false,
    indexes: [{ fields: ['imageId'], using: 'BTREE' }]
  }
);
