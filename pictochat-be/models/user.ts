import { Sequelize, Model, DataTypes, WhereOptions } from 'sequelize';
import { SequelizeConnectionService } from '../services/sequelize-connection-service';
import { ImageService } from '../services/image-service';

const sequelize: Sequelize = SequelizeConnectionService.getInstance();

export class User extends Model {
  static readonly PUBLIC_ATTRIBUTES = ['userId', 'email', 'username', 'userAvatarURI', 'hasAdminRole'];
  // Everything from PUBLIC_ATTRIBUTES excluding virtual columns
  static readonly PUBLIC_TABLE_COLUMNS = ['userId', 'email', 'username', 'hasAdminRole'];

  userId!: number;
  username!: string;
  password!: string;
  email: string;
  hasAdminRole: boolean;
  //temp pre authentication
  resetPasswordToken: string;
  resetPasswordExpiry: Date;
  isDisabled: boolean;

  disable() {
    this.isDisabled = true;
  }

  enable() {
    this.isDisabled = true;
  }

  /**
   * @returns JSON with only PUBLIC_ATTRIBUTES */
  getPublicJSON(): any {
    let json = {};
    for (let attr of User.PUBLIC_ATTRIBUTES) {
      json[attr] = this.get(attr);
      // json[attr] = this.getDataValue(attr as any);
    }
    return json;
  }

}

User.init(
  {
    userId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING },
    username: { type: DataTypes.STRING, unique: true },
    isDisabled: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
    // FIXME: Roles should be modelled as a seperate table or outsourced to something like Active Directory
    // (that way additional roles can be added without updating the schema of this table)
    hasAdminRole: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
    //temp pre authentication
    password: { type: DataTypes.STRING },
    resetPasswordToken: { type: DataTypes.STRING },
    resetPasswordExpiry: { type: DataTypes.DATE },
    // FIXME: All users currently assigned to the same static mock avatar
    userAvatarURI: {
      type: DataTypes.VIRTUAL,
      get() {
        return ImageService.getUserAvatarURI('DEFAULT_AVATAR');
      }
    }
  },
  {
    sequelize: sequelize,
    modelName: 'user',
    tableName: 'users',
    freezeTableName: true,
    // paranoid: true,
    indexes: [{ fields: ['userId'], using: 'BTREE' }, { fields: ['username'], using: 'BTREE' }]
  }
);
