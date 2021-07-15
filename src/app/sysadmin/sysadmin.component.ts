import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { AuthenticationService } from '../_services/authentication.service';

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

  constructor( private authenticationService: AuthenticationService){
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  confirmShutDown() {

    if (this.shuttingDown) {
      this.shuttingDown = false;
    } else {
      this.shuttingDown = true;
    }
    console.log('⚚ sysadmin - confirmShutdown: ', this.shuttingDown);
  }

  confirmRestart() {
    if (this.restarting) {
      this.restarting = false;
    } else {
      this.restarting = true;
    }
    console.log('⚚ sysadmin - confirmShutdown: ', this.restarting);

  }

  shutDown() {
    console.log('⚚ sysadmin - shutdown: ');
  }

  reBoot() {
    console.log('⚚ sysadmin - reboot: ');
  }

  ngOnInit(): void {
    console.log('⚚ sysadmin - onInit currentUser: ', this.currentUser);
    if (this.currentUser) {
      this.isAdmin = this.currentUser.admin;
    } else {
      this.currentUser.admin = false;
    }
  }

}
