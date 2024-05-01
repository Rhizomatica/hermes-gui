import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../../interfaces/user';
import { AuthenticationService } from '../../../_services/authentication.service';
import { GPSService } from '../../../_services/gps.service';
import { GlobalConstants } from 'src/app/global-constants';

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
  error = Error
  errorAlert = false
  loading = false
  files: string[]
  url = GlobalConstants.apiURL

  constructor(private authenticationService: AuthenticationService,
    private gpsService: GPSService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }


  getGPSFiles(): void {
    this.gpsService.getStoredGPSFiles().subscribe(
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

  dowloadFile(file){
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

  ngOnInit(): void {
    this.getGPSFiles()
  }

  ngOnDestroy() {
  }

}


