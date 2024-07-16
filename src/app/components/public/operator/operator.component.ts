import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { User } from 'src/app/interfaces/user';
import { RadioService } from '../../../_services/radio.service';
import { Subscription, interval } from 'rxjs';
import { SharedService } from 'src/app/_services/shared.service';
import { ApiService } from 'src/app/_services/api.service';
import { GPSService } from 'src/app/_services/gps.service';

@Component({
  selector: 'operator',
  templateUrl: './operator.component.html',
  styleUrls: ['./operator.component.less']
})

export class OperatorComponent implements OnInit {

  currentUser: User = null
  admin: boolean = false
  systemData: object
  loading: boolean = false
  error: Error
  poolSystemData: Subscription
  radio: any = []
  diskSpace: string = '0'
  gpsStatus: boolean

  constructor(
    private authenticationService: AuthenticationService,
    private radioService: RadioService,
    private sharedService: SharedService,
    private apiService: ApiService,
    private gpsService: GPSService



  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if (this.currentUser)
      this.admin = this.currentUser.admin
  }

  getSystemData() {
    // this.loading = true
    // this.radioService.getSystemData().subscribe(
    //   (res: any) => {
    //     if (res)
    //       this.systemData = res

    //     this.loading = false
    //   },
    //   (err) => {
    //     this.error = err;
    //     this.loading = false
    //   }
    // );
  }

  getGPSStatus(): void {
    this.loading = true
    this.gpsService.getGPSStatus().subscribe(
      (res: any) => {
        if (res)
          this.gpsStatus = res

        this.loading = false
      },
      (err) => {
        this.error = err;
        this.loading = false
      }
    );
  }

  getSystemStatus(): void {
    this.loading = true
    this.apiService.getStatus().subscribe(
      (res: any) => {

        this.diskSpace = (res.diskfree /1024 /1024).toFixed(3)
        this.loading = false
      },
      (err) => {
        this.error = err;
        this.loading = false
      }
    );
  }

  ngOnInit(): void {
    this.radio = this.sharedService.radioObj.value

    // this.getSchedules()
    this.getGPSStatus()
    this.getSystemStatus()

    this.poolSystemData = interval(10000).subscribe((val) => {
      this.getSystemData()
    });


    // Modem Status
    // Signal-to-noise ratio (SNR) --new
    // Bitrate --new
    // Transmission List -- maybe from transmission list
    // Pending Transmission -- maybe from transmission list
    // Successful Transmission
    // Re-transmissions count
    //
    
    // ONE API CALL
    // Scheduled transmission
    // GPS Status
    // Remote Devices --new
    // Local Storage
  }
}
