import { Component, OnInit } from '@angular/core';
// import { UserService } from './user.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './_services/authentication.service';
import { ApiService } from './_services/api.service';
import { User } from './user';
import { DarkModeService, DARK_MODE_OPTIONS } from 'angular-dark-mode';

import { Api } from './api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  currentUser: User;
  serverRes: any;
  error: any;
  system: any;
  fullStats: boolean = false;
  serverError: boolean = false;
  criticSpace: boolean = false;
  toggleButton = document.querySelector('.dark-button');
  darkMode$: Observable<boolean> = this.darkModeService.darkMode$;



  title = 'hermes.radio';
  constructor(
     private router: Router,
     private authenticationService: AuthenticationService,
     private apiService: ApiService,
  	 private darkModeService: DarkModeService
    ){
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  getSystemStatus(): void{
    this.apiService.getStatus().subscribe(
      (res: any) => {
        this.system = res;
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

  showFullStatus(){
    if (!this.fullStats) {
      this.fullStats = true;
      //console.log(this.fullStats);
    } else {
      this.fullStats  = false;
      //console.log(this.fullStats);
      }
    }
  
  showServerAlert() {
   if (!this.serverError) {
     this.serverError = true;
     //console.log(this.serverError);
   } else {
     this.serverError  = false;
     //console.log(this.serverError);
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
  }
}