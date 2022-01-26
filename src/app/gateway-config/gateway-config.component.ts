import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { AuthenticationService } from '../_services/authentication.service';
import { ApiService } from '../_services/api.service';

@Component({
  selector: 'app-gateway-config',
  templateUrl: './gateway-config.component.html',
  styleUrls: ['./gateway-config.component.less']
})
export class GatewayConfigComponent implements OnInit {

  currentUser: User;
  isAdmin = true;
  enabled = true;
  schedules: any;
  error: any;

  constructor(
    private authenticationService: AuthenticationService,
    private apiService: ApiService) {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  getSchedules() {
    this.apiService.getSchedules().subscribe(
      (res: any) => {
        this.schedules = res;
        console.log(this.schedules);

        return res;
      },
      (err) => {
        this.error = err;
      }
    );
  }

  getSchedule($id) {
    this.apiService.getSchedule($id).subscribe(
      (res: any) => {
        this.schedules = res;
        console.log(this.schedules);

        return res;
      },
      (err) => {
        this.error = err;
      }
    );
  }

  ngOnInit(): void {
    console.log('⚚ sysadmin - onInit currentUser: ', this.currentUser);
    this.getSchedules();
    this.getSchedule('1');
    if (this.currentUser) {
      this.isAdmin = this.currentUser.admin;
    } else {
      this.isAdmin = false;
    }
  }

}
