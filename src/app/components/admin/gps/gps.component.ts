import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../../interfaces/user';
import { AuthenticationService } from '../../../_services/authentication.service';
import { GPSService } from '../../../_services/gps.service';
import { GlobalConstants } from 'src/app/global-constants';
import { NgForm } from '@angular/forms';

import { Subscription, interval } from 'rxjs';
// import { PolylineSeries } from '@amcharts/amcharts5/.internal/charts/stock/drawing/PolylineSeries';

@Component({
  selector: 'gps',
  templateUrl: './gps.component.html',
  styleUrls: ['./gps.component.less']
})

export class GPSComponent implements OnInit, OnDestroy {

  currentUser: User
  admin: boolean = false
  error = Error
  errorAlert = false
  loading = false
  files: string[]
  interval: number = 0
  range: number = 0
  email: string = null
  currentLatitude: number = null
  currentLongitude: number = null
  // currentLatitude: number = 21.732970
  // currentLongitude: number = 89.882957
  status: boolean = false
  urlDownloadFile: string = `${GlobalConstants.apiURL}/geolocation/file`
  urlDownloadAll: string = `${GlobalConstants.apiURL}/geolocation/files/all`
  pointSeries = null
  deleteConfirmation = false
  poolCoordinates: Subscription
  confirmSOS: boolean = false

  constructor(private authenticationService: AuthenticationService,
    private gpsService: GPSService
  ) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x
      if (this.currentUser)
        this.admin = this.currentUser.admin
    });
  }

  async getGPSFiles(): Promise<void> {
    try {
      const res: any = await this.gpsService.getStoredGPSFiles().toPromise();
      if (res) {
        this.files = res;
      }
    } catch (err) {
      this.error = err;
      this.errorAlert = true
      this.loading = false;
    }
  }

  async getGPSStatus(): Promise<void> {
    try {
      const res: any = await this.gpsService.getGPSStatus().toPromise();
      if (res) {
        this.status = res;
      }
    } catch (err) {
      this.error = err;
      this.errorAlert = true
      this.loading = false;
    }
  }

  async getInterval(): Promise<void> {
    try {
      const res: any = await this.gpsService.getInterval().toPromise();
      if (res) {
        this.interval = res;
      }
    } catch (err) {
      this.error = err;
      this.errorAlert = true
      this.loading = false;
    }
  }

  async getFileRangeTime(): Promise<void> {
    try {
      const res: any = await this.gpsService.getFileRangeTime().toPromise();
      if (res) {
        this.range = parseInt(res) / 60;
      }
    } catch (err) {
      this.error = err;
      this.errorAlert = true
      this.loading = false;
    }
  }

  async getEmail(): Promise<void> {
    try {
      const res: any = await this.gpsService.getEmail().toPromise();
      if (res) {
        this.email = res;
      }
    } catch (err) {
      this.error = err;
      this.errorAlert = true
      this.loading = false;
    }
  }

  async getCurrentCoordinates(): Promise<void> {
    try {
      const res: any = await this.gpsService.getCurrentCoordinates().toPromise();
      if (res && res.latitude !== null && res.longitude !== null) {
        this.currentLatitude = res.latitude;
        this.currentLongitude = res.longitude;
      }
      this.loading = false;
    } catch (err) {
      this.error = err;
      this.loading = false;
    }
  }

  updateGPSInterval(f: NgForm) {
    this.loading = true
    this.gpsService.updateGPSInterval(f.value.interval).subscribe(
      (res: any) => {
        this.loading = false
      },
      (err) => {
        this.error = err;
        this.loading = false
        this.errorAlert = true
      }
    );
  }

  updateFileRangeTime(f: NgForm) {
    this.loading = true

    if (f.value.range) {
      f.value.range = parseInt(f.value.range) * 60
    }

    this.gpsService.updateFileRangeTime(f.value.range).subscribe(
      (res: any) => {
        this.loading = false
      },
      (err) => {
        this.error = err;
        this.loading = false
        this.errorAlert = true
      }
    );
  }

  updateGPSEmail(f: NgForm) {
    this.loading = true
    this.gpsService.updateGPSEmail(f.value.email).subscribe(
      (res: any) => {
        this.loading = false
      },
      (err) => {
        this.error = err;
        this.loading = false
        this.errorAlert = true
      }
    );
  }

  toggleGPS(f: NgForm) {

    if (this.status) {
      this.status = false
    }
    else if (!this.status) {
      this.status = true
    }

    this.gpsService.toggleGPS(this.status).subscribe(
      (res: any) => {
        return null
      },
      (err) => {
        this.error = err;
        this.errorAlert = true
      }
    );
  }

  deleteAllStoredFiles() {
    if (!this.deleteConfirmation)
      return this.deleteConfirmation = true


    if (this.deleteConfirmation)
      return this.deleteConfirmation = false
  }

  confirmDeleteAllStoredFiles() {
    this.deleteConfirmation = false
    this.loading = true
    this.gpsService.deleteAllStoredFiles().subscribe(
      (res: any) => {
        if (res)
          this.getGPSFiles()
        this.loading = false
      },
      (err) => {
        this.error = err;
        this.loading = false
        this.errorAlert = true
      }
    );
  }

  SOSEmergency() {
    if (this.confirmSOS)
      return this.confirmSOS = false


    if (!this.confirmSOS)
      return this.confirmSOS = true
  }

  confirmSOSEmergency() {
    this.confirmSOS = false
    this.loading = true
    this.gpsService.SOSEmergency().subscribe(
      (res: any) => {
        if (res)
          this.loading = false
      },
      (err) => {
        this.error = err;
        this.loading = false
        this.errorAlert = true
      }
    );
  }

  closeError(): void {
    this.errorAlert = false;
  }

  ngOnInit(): void {
    this.loading = true
    this.getGPSFiles()
    this.getGPSStatus()
    this.getInterval()
    this.getFileRangeTime()
    this.getEmail()
    this.getCurrentCoordinates() //First call

    //Pool current coordinates
    this.poolCoordinates = interval(10000).subscribe((val) => {
      this.getCurrentCoordinates()
    });

  }

  ngOnDestroy() {
    if (this.poolCoordinates)
      this.poolCoordinates.unsubscribe()
  }
}
