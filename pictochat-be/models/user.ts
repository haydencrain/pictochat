import { Sequelize, Model, DataTypes, Transaction } from 'sequelize';
import { SequelizeConnectionService } from '../services/sequelize-connection-service';

const sequelize: Sequelize = SequelizeConnectionService.getInstance();

export class User extends Model {
  static readonly PUBLIC_ATTRIBUTES = [
    'userId',
    'userEmail',
    'username',
    'password',
    'resetPasswordToken',
    'resetPasswordExpiry'
  ];

  userId!: number;
  username!: string;
  password!: string;
  userEmail: string;
  //temp pre authentication
  resetPasswordToken: string;
  resetPasswordExpiry: Date;

  static async createUser(username: string, hashedPassword: string): Promise<User> {
    return await User.create({ username, password: hashedPassword });
  }

  static async getUser(username: string): Promise<User> {
    return User.findOne({
      attributes: {
        include: User.PUBLIC_ATTRIBUTES
      },
      where: { username }
    });
  }

  static async updateUser(userId: number, data: User): Promise<User> {
    const [numRows, [updatedUser]] = await User.update(data, { where: { userId } });
    return updatedUser;
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
    userEmail: { type: DataTypes.STRING },
    username: { type: DataTypes.STRING },
    //temp pre authentication
    password: { type: DataTypes.STRING },
    resetPasswordToken: { type: DataTypes.STRING },
    resetPasswordExpiry: { type: DataTypes.DATE }
  },
  {
    sequelize: sequelize,
    modelName: 'users',
    tableName: 'users',
    freezeTableName: true
  }
);
