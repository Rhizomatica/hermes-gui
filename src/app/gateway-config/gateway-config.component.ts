import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { AuthenticationService } from '../_services/authentication.service';
import { ApiService } from '../_services/api.service';
import { Schedule } from '../schedule';

@Component({
  selector: 'app-gateway-config',
  templateUrl: './gateway-config.component.html',
  styleUrls: ['./gateway-config.component.less']
})
export class GatewayConfigComponent implements OnInit {

  currentUser: User;
  isAdmin = true;
  enabled = true;
  error: any;
  noSchedules = true;
  isEditing = false;
  selectedSchedule: Schedule[];
  schedules: Schedule[];
  emptySchedule = false;

  constructor(
    private authenticationService: AuthenticationService,
    private apiService: ApiService) {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  getSchedules():void {
    this.apiService.getSchedules().subscribe(
      (res: any) => {
        this.schedules = res;
        this.noSchedules = false;
        console.log(this.schedules, 'aaaaa');
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
        console.log(this.schedules, 'iiiii');

        return res;
      },
      (err) => {
        this.error = err;
      }
    );
  }

  onSelect(schedule): void {
    this.selectedSchedule = schedule;
    this.isEditing = true;
    // console.log('⚚ management - onSelect: isEditing? ', this.isEditing);
    this.emptySchedule = false;
    // console.log('⚚ management - onSelect: isEditing? ', this.selectedUser);

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
