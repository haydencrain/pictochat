import { Sequelize, Model, DataTypes } from 'sequelize';
import { SequelizeConnectionService } from '../services/sequelize-connection-service';

const sequelize: Sequelize = SequelizeConnectionService.getInstance();

export class ChallengeRate extends Model {
  rateId!: number;
  rate: number;
}

ChallengeRate.init(
  {
    rateId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rate: { type: DataTypes.DOUBLE }
  },
  {
    sequelize: sequelize,
    modelName: 'challengeRate',
    tableName: 'challenge_rates',
    freezeTableName: true
  }
);
