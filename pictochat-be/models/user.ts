import { Sequelize, Model, DataTypes, Transaction } from 'sequelize';
import { SequelizeConnectionService } from '../services/sequelize-connection-service';

const sequelize: Sequelize = SequelizeConnectionService.getInstance();

export class User extends Model {
  static readonly PUBLIC_ATTRIBUTES = [
    'userId',
    'email',
    'username',
    'password',
    'resetPasswordToken',
    'resetPasswordExpiry'
  ];

  userId!: number;
  username!: string;
  password!: string;
  email: string;
  //temp pre authentication
  resetPasswordToken: string;
  resetPasswordExpiry: Date;

  static async createUser(username: string, hashedPassword: string): Promise<User> {
    return await User.create({ username, password: hashedPassword });
  }

  static async getUserByUsername(username: string): Promise<User> {
    return User.findOne({
      attributes: {
        include: User.PUBLIC_ATTRIBUTES
      },
      where: { username }
    });
  }

  static async getUser(userId: number): Promise<User> {
    return await User.findOne({
      attributes: {
        include: User.PUBLIC_ATTRIBUTES
      },
      where: { userId }
    });
  }

  static async getUsers(): Promise<User[]> {
    return User.findAll({
      attributes: {
        include: User.PUBLIC_ATTRIBUTES
      },
      order: [['userId', 'ASC']]
    });
  }
}

User.init(
  {
    userId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING },
    username: { type: DataTypes.STRING },
    //temp pre authentication
    password: { type: DataTypes.STRING },
    resetPasswordToken: { type: DataTypes.STRING },
    resetPasswordExpiry: { type: DataTypes.DATE }
  },
  {
    sequelize: sequelize,
    modelName: 'user',
    tableName: 'users',
    freezeTableName: true
  }
);
