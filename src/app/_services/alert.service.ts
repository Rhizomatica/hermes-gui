import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})

export class AlertService {

  constructor(private toastr: ToastrService) { }

  alerts: string[] = [];

  add(alert: string): void {
    this.alerts.push(alert);
  }

  clear(): void {
    this.alerts = [];
  }
  
  showSuccess(code, msg = 'Success'){
    this.toastr.success(msg, code);
  }

  showError(code, msg = 'Error'){
    this.toastr.error(msg, code);
  }
}
