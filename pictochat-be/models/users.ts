import { Sequelize, Model, DataTypes } from 'sequelize';
import { SequelizeConnectionService } from '../services/sequelize-connection-service';

const sequelize: Sequelize = SequelizeConnectionService.getInstance();

export class Users extends Model {
  static readonly PUBLIC_ATTRIBUTES = ['userId', 'userEmail', 'userName', 'password'];

  userId!: number;
  userEmail!: string;
  username!: string;
  //temp pre authentication
  password!: string;




  static addUser(attrs: { username: string, password: string }): Users {
    let users: Users = Users.build(attrs);
    return users;
  }

  static async getUser(userId: number): Promise<Users> {
    return Users.findOne({
      attributes: {
        include: Users.PUBLIC_ATTRIBUTES
      },
      where: { userId: userId }
    });
  }

  static async getUsers(): Promise<Users[]> {
    return Users.findAll({
      attributes: {
        include: Users.PUBLIC_ATTRIBUTES
      },
      order: [['userId', 'ASC']]
    });
  }
}

Users.init(
  {
    userId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userEmail: { type: DataTypes.STRING },
    username: { type: DataTypes.STRING },
    //temp pre authentication
    password: { type: DataTypes.STRING }
  },
  {
    sequelize: sequelize,
    modelName: 'users',
    tableName: 'users',
    freezeTableName: true
  }
);
