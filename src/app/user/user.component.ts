import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { Station } from '../station';
import { StationService } from '../station.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit {

  
  users: User[];
  stations: Station[];
  constructor(private stationService: StationService, private userService: UserService) {}
  
  
  ngOnInit(): void {
    this.stationService.getStations()
    .subscribe(stations =>  this.stations = stations)

    this.userService.getUsers()
    .subscribe(users =>  this.users = users)


  }

}
