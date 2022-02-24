import { Component, OnInit } from '@angular/core';
// import { UserService } from './user.service';
import { Router } from '@angular/router';
import { Observable, interval } from 'rxjs';
import { AuthenticationService } from './_services/authentication.service';
import { ApiService } from './_services/api.service';
import { User } from './user';
import { DarkModeService, DARK_MODE_OPTIONS } from 'angular-dark-mode';
import { RadioService } from './_services/radio.service';


import { Api } from './api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  currentUser: User;
  public iTimer = interval(30000);
  serverRes: any;
  error: any;
  system: any;
  fullStats = false;
  serverError = false;
  criticSpace = false;
  toggleButton = document.querySelector('.dark-button');
  darkMode$: Observable<boolean> = this.darkModeService.darkMode$;
  radio: any;
  protection = true;
  radioError = false;
  res: any;
  errorAlert = false;
  resetting = false;
  subscript: any;

  title = 'hermes.radio';
    constructor(
     private router: Router,
     private authenticationService: AuthenticationService,
     private apiService: ApiService,
     private radioService: RadioService,
  	 private darkModeService: DarkModeService
     )
    {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  getSystemStatus(): void{
    this.apiService.getStatus().subscribe(
      (res: any) => {
        this.system = res;
        // console.log('SystemStatus');
        if (this.system.diskfree < 10485760) {
          this.criticSpace = true;
        }
        return res;
      },
      (err) => {
        this.error = err;
      }
    );
  }

  resetProtection() {
    if (this.resetting === true)
    {
      this.resetting = false;
    } else {
      this.resetting = true;
    }
  }


  confirmReset() {
    this.radioService.radioResetProtection().subscribe(
      (res: any) => {
      this.res = res;
      if (this.res === 1) {
        this.radio.protection = true;
        this.protection = this.radio.protection;
      }
      // this.fileIsProcessing = true;
      },
      (err) => {
      this.error = err;
      this.errorAlert = true;
      }
    );
  }

  getRadioStatus(): void{
    this.radioService.getRadioStatus().subscribe(
      (res: any) => {
        this.radio = res;
        this.protection = this.radio.protection;
        // console.log('hahah' + this.ptt);
        return res;
      },
      (err) => {
        this.error = err;
        this.radioError = true;
        console.log(this.error);
      }
    );
  }

  showFullStatus(){
    if (!this.fullStats) {
      this.fullStats = true;
      // console.log(this.fullStats);
    } else {
      this.fullStats  = false;
      // console.log(this.fullStats);
      }
    }

  showServerAlert() {
   if (!this.serverError) {
     this.serverError = true;
     // console.log(this.serverError);
   } else {
     this.serverError  = false;
     // console.log(this.serverError);
     }
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
    this.currentUser = null;
    console.log('⚚ app: user logout');
  }
  onToggle(): void {
    this.darkModeService.toggle();
  }

  // TODO double check
  // ERROR: 54:3   use-lifecycle-interface
  //  Lifecycle interface OnInit should be implemented for method ngOnInit. (https://angular.io/styleguide#style-09-01)
  ngOnInit(): void {
     this.getSystemStatus();
     this.getRadioStatus();
     this.subscript = this.iTimer.subscribe(() => this.getSystemStatus());

  }

}
