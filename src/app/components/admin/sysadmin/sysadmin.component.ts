import { Component, OnInit } from '@angular/core';
import { User } from '../../../interfaces/user';
import { AuthenticationService } from '../../../_services/authentication.service';
import { ApiService } from '../../../_services/api.service';
import { GlobalConstants } from '../../../global-constants';
import { UtilsService } from '../../../_services/utils.service';

@Component({
  selector: 'app-sysadmin',
  templateUrl: './sysadmin.component.html',
  styleUrls: ['./sysadmin.component.less']
})

export class SysadminComponent implements OnInit {
  currentUser: User;
  isAdmin = true;
  shuttingDown = false;
  restarting = false;
  shuttingDownNow = false;
  rebootingDownNow = false;
  error: any;
  isGateway:boolean = GlobalConstants.gateway
  errorAlert = false;
  alertBrowserXP: Boolean = false
  loginForm = false;
  
  constructor(
    private authenticationService: AuthenticationService,
    private apiService: ApiService,
    private utils: UtilsService
    ) {
      this.checkBrowser(utils.detectBrowserName())
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }


  confirmShutDown() {
    this.shuttingDown = true;
  }

  cancelShutDown() {
    this.shuttingDown = false;
    this.shuttingDownNow = false;
  }

  confirmReboot() {
    this.restarting = true;
  }

  cancelReboot() {
    this.restarting = false;
    this.shuttingDownNow = false;

  }

  confirmRestart() {
      this.restarting = true;
  }

  cancelRestart() {
    this.restarting = false;
    this.shuttingDownNow = false;
  }

  shutDown() {
    this.shuttingDownNow = true;
    this.apiService.sysShutdown();

  }

  reboot() {
    this.rebootingDownNow = true;
    this.apiService.sysReboot();

  }

  reload() {
    this.ngOnInit();
    this.rebootingDownNow = false;
    this.shuttingDownNow = false;
    this.restarting = false;
    this.shuttingDown = false;

  }

  checkBrowser(browser){
    var browserWarning = localStorage.getItem('browserWarning');

    if(browserWarning === null && browser !== 'chrome'){
      localStorage.setItem('browserWarning', 'true');
      this.alertBrowserXP = true
    }
  }
  
  closeBrowserAlert(){
    this.alertBrowserXP = false
  }

  ngOnInit(): void {
    if (this.currentUser) {
      this.isAdmin = this.currentUser.admin;
      this.loginForm = false;
    } else {
      this.isAdmin = false;
      this.loginForm = true;
    }
  }

}
