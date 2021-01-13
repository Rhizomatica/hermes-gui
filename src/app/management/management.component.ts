import { Component, OnInit } from '@angular/core';

import { User } from '../user';
import { UserService } from '../user.service';
import { Station } from '../station';
import { StationService } from '../station.service';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.less']
})
export class ManagementComponent implements OnInit {
  error = '';
  success = '';
  test = '';
  users: User[];
  stations: Station[];
  selectedUser: User[];

  constructor(private userService: UserService, private stationService: StationService) { }

  getUsers(): void {
    this.userService.getUsers().subscribe(
      (res: any) => {
        this.users = res;
      },
      (err) => {
        this.error = err;
      }
    );
  }

  onSelect(user): void {
    this.selectedUser = user;
    console.log(this.selectedUser);
  }


  ngOnInit(): void {
    this.getUsers();

    this.stationService.getStations()
    .subscribe(stations =>  this.stations = stations);

  }
}
