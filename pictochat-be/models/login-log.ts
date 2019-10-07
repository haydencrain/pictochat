import { Sequelize, Model, DataTypes, Op, FindOptions } from 'sequelize';
import { SequelizeConnectionService } from '../services/sequelize-connection-service';
import { User } from './user';

const sequelize: Sequelize = SequelizeConnectionService.getInstance();

export class LoginLog extends Model {
  userId: number;
  loginTimestamp: Date;
  deviceId: string;
}

LoginLog.init(
  {
    _id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userId: {type: DataTypes.INTEGER},
    loginTimestamp: {type: DataTypes.DATE},
    deviceId: {type: DataTypes.STRING}
  },
  {
    sequelize,
    modelName: 'LoginLog',
    tableName: 'login_logs',
    underscored: false,
    indexes: [
      { fields: ['userId'], using: 'BTREE' },
      { fields: ['deviceId'], using: 'BTREE' },
      { fields: ['deviceId', 'userId'], using: 'BTREE' }
    ]
  }
);

LoginLog.belongsTo(User, { as: 'user', foreignKey: 'userId', targetKey: 'userId', constraints: false });
