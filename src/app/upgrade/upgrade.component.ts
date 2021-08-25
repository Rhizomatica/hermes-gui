import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { AuthenticationService } from '../_services/authentication.service';


@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.less']
})
export class UpgradeComponent implements OnInit {

restore: boolean = false;
restoreConf: boolean = false;
restoring: any;
error: any;

constructor( private authenticationService: AuthenticationService, private apiService: ApiService){
    
  //this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
}

  restoreAlert() {
  this.restore =true;
  }

  restoreConfirm() {
    this.restoreConf = true;
    this.restore = false;
  }

  cancelRestore() {
    this.restore = false;
    this.restoreConf = false;
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
      }
    );

  }



  ngOnInit(): void {
  }

}
