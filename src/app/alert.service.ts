import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  alerts: string[] = [];

  add(alert: string) {
    this.alerts.push(alert);
  }

  clear() {
    this.alerts = [];
  }
}
