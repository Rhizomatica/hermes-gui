import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../../interfaces/user';
import { AuthenticationService } from '../../../_services/authentication.service';
import { GPSService } from '../../../_services/gps.service';
import { GlobalConstants } from 'src/app/global-constants';
import { NgForm } from '@angular/forms';

export interface LogList {
  line: string;
  content: string;
}

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
  url = GlobalConstants.apiURL
  delay: number = 120
  dump: number = 3600
  currentCoordinates: string = "21.0420223,105.8212841"
  status: boolean = true

  constructor(private authenticationService: AuthenticationService,
    private gpsService: GPSService
  ) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x
      if (this.currentUser)
        this.admin = this.currentUser.admin
    });
  }


  getGPSFiles(): void {
    this.loading = true
    this.gpsService.getStoredGPSFiles().subscribe(
      (res: any) => {
        if (res && res.message)
          this.files = res.message

        this.loading = false
      },
      (err) => {
        this.error = err;
        this.loading = false
      }
    );
  }

  getCurrentCoordinates() {
    this.loading = true
    this.gpsService.getCurrentCoordinates().subscribe(
      (res: any) => {
        if (res && res.message)
          this.currentCoordinates = res.message

        this.loading = false
      },
      (err) => {
        this.error = err;
        this.loading = false
      }
    );
  }

  dowloadFile(file) {
    this.gpsService.getStoredGPSFileByName(file).subscribe(
      (res: any) => {
        if (res && res.message)
          this.files = res.message
      },
      (err) => {
        this.error = err;
        this.loading = false
      }
    );
  }

  updateGPSDelay(f: NgForm) {
    this.gpsService.updateGPSDelay(f.value.delay).subscribe(
      (res: any) => {
        if (res && res.message)
          this.delay = res.message
      },
      (err) => {
        this.error = err;
        this.loading = false
      }
    );
  }

  updateGPSFileDumpTime(f: NgForm) {
    this.gpsService.updateGPSFileDumpTime(f.value.dump).subscribe(
      (res: any) => {
        if (res && res.message)
          this.delay = res.message
      },
      (err) => {
        this.error = err;
        this.loading = false
      }
    );
  }

  toggleGPS(f: NgForm) {

    if(this.status){
      this.status = false
    }
    else if(!this.status){
      this.status = true
    }

    this.gpsService.toggleGPS(this.status).subscribe(
      (res: any) => {
        if (res && res.message)
          this.delay = res.message
      },
      (err) => {
        this.error = err;
        this.loading = false
      }
    );
  }

  ngOnInit(): void {
    this.getGPSFiles()
    this.getCurrentCoordinates()
  }

  ngOnDestroy() {
  }

}


