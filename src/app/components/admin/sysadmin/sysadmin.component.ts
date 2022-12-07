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
  system: any;
  error: any;
  isGateway: false;
  loginForm = false;
  errorAlert = false;
  alertBrowserXP: Boolean = false

  constructor(
    private authenticationService: AuthenticationService,
    private apiService: ApiService,
    private utils: UtilsService
    ) {
      this.checkBrowser(utils.detectBrowserName())

      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  getSystemStatus(): void{
    this.apiService.getStatus().subscribe(
      (res: any) => {
        this.system = res;
        this.isGateway = this.system.gateway;
        return res;
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
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

  goHamRadioRemote() {
    window.open(GlobalConstants.radioRemoteUrl)
  }

  checkBrowser(browser){
    if(browser !== 'chrome')
      this.alertBrowserXP = true
  }
  
  closeBrowserAlert(){
    this.alertBrowserXP = false
  }

  ngOnInit(): void {
    this.getSystemStatus();
    if (this.currentUser) {
      this.isAdmin = this.currentUser.admin;
      this.loginForm = false;
    } else {
      this.isAdmin = false;
      this.loginForm = true;
    }
  }

}
