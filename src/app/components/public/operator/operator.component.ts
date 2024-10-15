import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { User } from 'src/app/interfaces/user';
import { Subscription, interval } from 'rxjs';
import { SharedService } from 'src/app/_services/shared.service';
import { ApiService } from 'src/app/_services/api.service';
import { GPSService } from 'src/app/_services/gps.service';
import { UUCPService } from 'src/app/_services/uucp.service';


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
  activeSchedule: boolean = false
  queueSize: number = 0
  queueSizeB: number = 0
  bitrateData: any = []
  snrData: any = []


  constructor(
    private authenticationService: AuthenticationService,
    private sharedService: SharedService,
    private apiService: ApiService,
    private gpsService: GPSService,
    private uucpService: UUCPService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if (this.currentUser)
      this.admin = this.currentUser.admin
  }

  public getSchedules(): void {
    this.loading = true
    this.apiService.getSchedules().subscribe(
      (res: any) => {

        var enabledSchedules = res.filter((a) => { return a.enable == 1 })

        if (enabledSchedules.length > 0)
          this.activeSchedule = true

        this.loading = false
      },
      (err) => {
        this.error = err;
        // this.errorAlert = true
        this.loading = false
      }
    );
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

        this.diskSpace = (res.diskfree / 1024 / 1024).toFixed(3)
        this.loading = false
      },
      (err) => {
        this.error = err;
        this.loading = false
      }
    );
  }

  getQueue(): void {
    this.loading = true
    this.uucpService.getQueue().subscribe(
      res => {
        this.queueSize = res.length
        if (Object.keys(res).length > 0) {
          this.getQueueSizeB(res)
        }
        this.loading = false
      },
      (err) => {
        this.error = err
        this.loading = false
      }
    );
  }

  //Maybe go to utils?
  getQueueSizeB(queue) {
    if (queue && queue.length > 0) {
      for (let i = 0; i < Object.keys(queue).length; i++) {
        this.queueSizeB += parseInt(queue[i].size)
      }
    }
  }

  ngOnInit(): void {
    this.radio = this.sharedService.radioObj.value

    this.getSchedules()
    this.getGPSStatus()
    this.getSystemStatus() //Disk free space
    this.getQueue()

    this.poolSystemData = interval(10000).subscribe((val) => {
      // this.getSystemData()
      this.getQueue() // TODO - needed?
    })

    // Modem Status
    // Signal-to-noise ratio (SNR) --new
    // Bitrate --new
    // Successful Transmission --new
    // Re-transmissions count
    //

    // ONE API CALL
    // Remote Devices --new
  }
}
