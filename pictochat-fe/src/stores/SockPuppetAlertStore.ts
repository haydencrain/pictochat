import { observable, action, ObservableMap, computed, runInAction } from 'mobx';
import { ISockPuppetAlert, SockPuppetAlert } from '../models/SockPuppetAlert';
import { ApiService } from '../services/ApiService';
import UserStore from './UserStore';
import { User } from '../models/User';

export class SockPuppetAlertStore {
  userStore: UserStore;
  @observable isLoading: boolean = false;
  @observable alertMap: ObservableMap<any, SockPuppetAlert> = observable.map(undefined, { name: 'alertMap' });

  constructor(userStore: UserStore) {
    this.userStore = userStore;
  }

  @action.bound
  async loadAlerts(userLimit: number) {
    this.isLoading = true;
    try {
      let alerts: ISockPuppetAlert[] = await ApiService.get('/sock-puppet-alert', { userLimit });
      runInAction(() => {
        alerts.forEach((alertJson: any) => {
          alertJson.users = alertJson.users.map((user: any) => {
            return this.userStore.putInUserMap(new User(user));
          });

          const alert: SockPuppetAlert = new SockPuppetAlert(alertJson);
          if (this.alertMap.has(alert.deviceId)) {
            this.alertMap.get(alert.deviceId).replace(alert);
          } else {
            this.alertMap.set(alert.deviceId, alert);
          }
        });
      });
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }

  @computed get alerts() {
    return Array.from(this.alertMap.values());
  }
}
