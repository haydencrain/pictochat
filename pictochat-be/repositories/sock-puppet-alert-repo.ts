import { SockPuppetAlert } from "../models/sock-puppet-alert";
import { User } from "../models/user";
import { LoginLog } from "../models/login-log";
import { SequelizeConnectionService } from "../services/sequelize-connection-service";

interface DeviceUserPair extends User {
  deviceId: string;
}

const sequelize = SequelizeConnectionService.getInstance();

export class SockPuppetAlertRepo {
  static readonly DEFAULT_CONCURRNENT_USER_LIMIT = 2;

  /**
   * Find any devices that have been used to login as > CONCURRNENT_USER_LIMIT users
   * and return an alert for them */
  static async getSockPuppetAlerts(userLimit: number = this.DEFAULT_CONCURRNENT_USER_LIMIT): Promise<SockPuppetAlert[]> {
    const suspiciousDeviceUserPairs = await SockPuppetAlertRepo.getSuspiciousDeviceUserPairs(userLimit);

    // Group <device, user> user pairs into alerts
    let deviceAlertMap: { [deviceId: string]: SockPuppetAlert } = {};
    let alerts: SockPuppetAlert[] = [];
    for (let deviceUserPair of suspiciousDeviceUserPairs) {
      const deviceId = deviceUserPair.getDataValue('deviceId');
      const user = deviceUserPair;

      if (!deviceAlertMap[deviceId]) {
        const alert = new SockPuppetAlert(deviceId);
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
    // NOTE: queryOptions.replacements will escape value of userLimit before passing it to the db
    const queryOptions = { model: User, replacements: { userLimit: userLimit } };
    // has format {deviceId, ...<User properties>}
    const suspiciousDeviceUserPairs: User[] = await sequelize.query(
      `SELECT DISTINCT "loginLogs"."deviceId", ${userSelectStmtList}
      FROM
        "${LoginLog.tableName}" AS "loginLogs"
        INNER JOIN (
          SELECT "deviceId", COUNT(DISTINCT "loginLog"."userId") AS "userCount"
          FROM
            "${LoginLog.tableName}" AS "loginLog"
            INNER JOIN ${User.tableName} AS "user"
            ON "loginLog"."userId" = "user"."userId"
          WHERE "user"."hasAdminRole" = FALSE AND "user"."isDisabled" = FALSE
          GROUP BY "deviceId"
          HAVING COUNT(DISTINCT "loginLog"."userId") > :userLimit
        ) AS "deviceUserCounts"
        ON "loginLogs"."deviceId" = "deviceUserCounts"."deviceId"
        INNER JOIN ${User.tableName} AS "user"
        ON "loginLogs"."userId" = "user"."userId"
      WHERE "user"."hasAdminRole" = FALSE AND "user"."isDisabled" = FALSE
      `,
      queryOptions
    );

    return suspiciousDeviceUserPairs as DeviceUserPair[];
  }
}
