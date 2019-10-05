import { SequelizeConnectionService } from '../services/sequelize-connection-service';
import { LoginLog } from './login-log';
import { User } from './user';
import { QueryTypes } from 'sequelize/types';

const CONCURRNENT_USER_LIMIT = 2;

const sequelize = SequelizeConnectionService.getInstance();

export interface ISockPuppertAlert {
  deviceId: string;
  users: User[];
}

interface DeviceUserPair extends User {
  deviceId: string;
}

export class SockPuppertAlert {
  deviceId: string;
  users: User[];

  constructor(deviceId: string, users?: User[]) {
    this.deviceId = deviceId;
    this.users = users || [];
  }

  toJSON() {
    return {
      deviceId: this.deviceId,
      users: this.users.map(user => user.getPublicJSON())
    };
  }

  // STATIC/COLLECTION METHODS

  /**
   * Find any devices that have been used to login as > CONCURRNENT_USER_LIMIT users
   * and return an alert for them */
  static async getSockPuppetAlerts(userLimit: number = CONCURRNENT_USER_LIMIT): Promise<SockPuppetAlert[]> {
    const suspiciousDeviceUserPairs = await SockPuppertAlert.getSuspiciousDeviceUserPairs(userLimit);
    // console.log('suspiciousDeviceUserPairs: ', suspiciousDeviceUserPairs);

    // Group <device, user> user pairs into alerts
    let deviceAlertMap: { [deviceId: string]: SockPuppertAlert } = {};
    let alerts = [];
    for (let deviceUserPair of suspiciousDeviceUserPairs) {
      const deviceId = deviceUserPair.getDataValue('deviceId');
      const user = deviceUserPair;

      if (!deviceAlertMap[deviceId]) {
        const alert = new SockPuppertAlert(deviceId);
        deviceAlertMap[deviceId] = alert;
        alerts.push(alert);
      }

      const alert = deviceAlertMap[deviceId];
      alert.users.push(user);
    }

    return alerts;
  }

  /**
   * Finds device, user combinations for any devices that have been used
   * to login as > CONCURRNENT_USER_LIMIT users
   *
   * @returns Array of users annotated with the suspect deviceId (user may
   *     appear multiple times if accessed by multiple suspecious devices)
   */
  private static async getSuspiciousDeviceUserPairs(userLimit: number): Promise<DeviceUserPair[]> {
    const userColumns = User.PUBLIC_TABLE_COLUMNS.map(colName => `"user"."${colName}" AS "${colName}"`);
    const userSelectStmtList = userColumns.join(', ');
    const queryOptions = { model: User, replacements: { userLimit: userLimit } };
    // has format {deviceId, ...<User properties>}
    const suspiciousDeviceUserPairs: User[] = await sequelize.query(
      `SELECT DISTINCT "loginLogs"."deviceId", ${userSelectStmtList}
      FROM
        "${LoginLog.tableName}" AS "loginLogs"
        INNER JOIN (
          SELECT "deviceId", COUNT(DISTINCT "userId") AS "userCount"
          FROM "${LoginLog.tableName}"
          GROUP BY "deviceId"
          HAVING COUNT(DISTINCT "userId") > :userLimit
        ) AS "deviceUserCounts"
        ON "loginLogs"."deviceId" = "deviceUserCounts"."deviceId"
        INNER JOIN ${User.tableName} AS "user"
        ON "loginLogs"."userId" = "user"."userId"
      WHERE "user"."hasAdminRole" = FALSE
      `,
      queryOptions
    );
    return suspiciousDeviceUserPairs as DeviceUserPair[];
  }
}
