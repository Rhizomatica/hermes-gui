import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { AuthenticationService } from '../_services/authentication.service';


@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.less']
})
export class UpgradeComponent implements OnInit {
restore = false;
restoreConf = false;
upgradeConf = false;
restoring: any;
error: Error;
upgrade = false;
errorAlert = false;
currentUser: any;
isAdmin = false;

constructor( private authenticationService: AuthenticationService, private apiService: ApiService) {
  this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
}

closeError() {
  this.errorAlert = false;
}

  restoreAlert() {
  this.restore = true;
  }

  upgradeAlert() {
    this.upgrade = true;
    }

  restoreConfirm() {
    this.restoreConf = true;
    this.restore = false;
  }

  upgradeConfirm() {
    this.upgradeConf = true;
    this.upgrade = false;
  }

  cancelRestore() {
    this.restore = false;
    this.restoreConf = false;
  }

  cancelUpgrade() {
    this.upgrade = false;
    this.upgradeConf = false;
  }

  sysRestore() {
    console.log('restoring');
    this.apiService.sysRestore().subscribe(
      (res: any) => {
        this.restoring = res;
        return res;
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;

      }
    );

  }

  sysUpgrade() {
    console.log('upgrading');
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
