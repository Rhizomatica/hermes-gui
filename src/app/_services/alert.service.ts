import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AlertService {

  alerts: string[] = [];

  add(alert: string): void {
    this.alerts.push(alert);
  }

  clear(): void {
    this.alerts = [];
  }
}
