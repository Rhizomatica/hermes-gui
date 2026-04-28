import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { User } from 'src/app/interfaces/user';
import { SharedService } from 'src/app/_services/shared.service';
import { ApiService } from 'src/app/_services/api.service';
import { GPSService } from 'src/app/_services/gps.service';
import { UUCPService } from 'src/app/_services/uucp.service';
import { GlobalConstants } from 'src/app/global-constants';
import { UtilsService } from 'src/app/_services/utils.service';
import { RadioService } from 'src/app/_services/radio.service';


@Component({
  selector: 'operator',
  templateUrl: './operator.component.html',
  styleUrls: ['./operator.component.less']
})

export class OperatorComponent implements OnInit {

  currentUser: User = {} as User
  admin: boolean = false
  systemData!: object
  loading: boolean = false
  error!: Error
  errorAlert: boolean = false
  errormsg: string = ""
  radio: any = []
  diskSpace: string = '0'
  gpsStatus!: boolean
  activeSchedule: boolean = false
  queueSize: number = 0
  bitrateData: any = []
  snrData: any = []
  currentLatitude!: null
  currentLongitude!: null
  hasGps: boolean = GlobalConstants.hasGPS
  diskUsage: string = "0"
  showGraph: boolean = false

  constructor(
    private authenticationService: AuthenticationService,
    private sharedService: SharedService,
    private apiService: ApiService,
    private gpsService: GPSService,
    private uucpService: UUCPService,
    private utils: UtilsService,
    private radioService: RadioService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if (this.currentUser)
      this.admin = this.currentUser.admin

    if (this.utils.isItRuningLocal() && this.utils.isSBitxRadio())
      this.showGraph = false
    else
      this.showGraph = true
  }

  public getSchedules(): void {
    this.loading = true
    this.apiService.getSchedules().subscribe({
      next: (res: any) => {

        var enabledSchedules = res.filter((a: any) => { return a.enable == 1 })

        if (enabledSchedules.length > 0)
          this.activeSchedule = true

        this.loading = false
      },
      error: (err) => {
        this.error = err;
        this.loading = false
      }
    });
  }

  getGPSStatus(): void {
    if (!this.hasGps)
      return

    this.loading = true

    this.gpsService.getGPSStatus().subscribe({
      next: (res: any) => {
        if (res)
          this.gpsStatus = res

        this.loading = false
      },
      error: (err) => {
        this.error = err;
        this.loading = false
      }
    });
  }

  getSystemStatus(): void {
    this.loading = true
    this.apiService.getStatus().subscribe({
      next: (res: any) => {
        res.diskfree = res.diskfree / 1024 / 1024
        this.diskSpace = (res.diskfree).toFixed(3)
        var percentage = ((32 - res.diskfree) / 32) * 100
        this.diskUsage = percentage.toFixed(2) + "%"
        this.loading = false
      },
      error: (err) => {
        this.error = err;
        this.loading = false
      }
    });
  }

  getCurrentCoordinates() {

    if (!this.hasGps || !this.gpsStatus)
      return

    if (!this.currentLatitude && !this.currentLongitude)
      this.loading = true

    this.gpsService.getCurrentCoordinates().subscribe({
      next: (res: any) => {
        if (res && res.latitude !== null && res.longitude !== null) {
          this.currentLatitude = res.latitude
          this.currentLongitude = res.longitude

        }

        this.loading = false
      },
      error: (err) => {
        this.error = err;
        this.loading = false
      }
    });
  }

  stopTransmission(): void {
    this.loading = true;

    this.uucpService.stopTransmission().subscribe({
      next: (res: any) => {
        this.loading = false
      },
      error: (err) => {
        this.errormsg = err;
        this.errorAlert = true
        this.loading = false;
      }
    });
  }

  closeError() {
    this.errorAlert = false;
    this.errormsg = ""
  }

  resetProtection() {
    this.radioService.radioResetProtection(this.radio.profile).subscribe({
      next: (res: any) => {
        if (res === 1) {
          this.radio.protection = false;
        }
      },
      error: (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    });
  }

  ngOnInit(): void {
    this.radio = this.sharedService.radioObj.value
    this.getCurrentCoordinates()
    this.getSchedules()
    this.getGPSStatus()
    this.getSystemStatus() //Disk free space
  }
}
