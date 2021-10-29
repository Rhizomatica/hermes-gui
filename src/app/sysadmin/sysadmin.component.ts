import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { AuthenticationService } from '../_services/authentication.service';
import { ApiService } from '../_services/api.service';
import { Api } from '../api';

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

  constructor( private authenticationService: AuthenticationService, private apiService: ApiService){
    
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  confirmShutDown() {
    this.shuttingDown = true;
    console.log('⚚ sysadmin - confirmShutdown: ', this.shuttingDown);
  }

  cancelShutDown() {
    this.shuttingDown = false;
    this.shuttingDownNow = false;

  }

  confirmReboot() {
    this.restarting = true;
    console.log('⚚ sysadmin - confirmShutdown: ', this.shuttingDown);
  }

  cancelReboot() {
    this.restarting = false;
    this.shuttingDownNow = false;

  }

  confirmRestart() {

      this.restarting = true;

    console.log('⚚ sysadmin - confirmShutdown: ', this.restarting);
  }

  cancelRestart() {
    this.restarting = false;
    this.shuttingDownNow = false;
  }

  shutDown() {
    console.log('⚚ sysadmin - shutdown: ');
    this.shuttingDownNow = true;
    this.apiService.sysShutdown();

  }

  reboot() {
    console.log('⚚ sysadmin - reboot: ');
    this.shuttingDownNow = true;
    this.apiService.sysReboot();

  }


  ngOnInit(): void {
    console.log('⚚ sysadmin - onInit currentUser: ', this.currentUser);
    if (this.currentUser) {
      this.isAdmin = this.currentUser.admin;
    } else {
      this.isAdmin = false;
    }
  }

}
