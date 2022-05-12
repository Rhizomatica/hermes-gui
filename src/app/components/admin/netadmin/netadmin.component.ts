import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../_services/api.service';

@Component({
  selector: 'app-netadmin',
  templateUrl: './netadmin.component.html',
  styleUrls: ['./netadmin.component.less']
})

export class NetadminComponent implements OnInit {

  error: any
  system: any
  errorAlert = false

  constructor(
    private apiService: ApiService
  ) { }

  getSystemStatus(): void {
    this.apiService.getStatus().subscribe(
      (res: any) => {
        this.system = res
        return res
      },
      (err) => {
        this.error = err
        this.errorAlert = true
      }
    )
  }

  closeError() {
    this.errorAlert = false
  }

  ngOnInit(): void {
    this.getSystemStatus()
  }
}
