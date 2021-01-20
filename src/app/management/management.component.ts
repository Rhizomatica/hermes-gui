import { Component, OnInit } from '@angular/core';
import { NgForm} from '@angular/forms';
import { User } from '../user';
import { UserService } from '../user.service';
import { Station } from '../station';
import { StationService } from '../station.service';
import { Observable, throwError } from 'rxjs';
import { NgSearchFilterService } from 'ng-search-filter';
import { delay } from 'rxjs/operators';


@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.less']
})

export class ManagementComponent implements OnInit {

  searchUser: string;

  error = '';
  success = '';
  test = '';
  users: User[];
  stations: Station[];
  selectedUser: User[];
  control: any;
  isadmin = true;
  isEditing = false;

    constructor(private userService: UserService, private stationService: StationService) {

  }

loggedin() {
    if(this.isadmin) {
      this.isadmin = false;
      console.log(this.isadmin);
    } else {
      this.isadmin = true;
      console.log(this.isadmin);
    }
  }

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
    this.isEditing = true;
    console.log(this.isEditing);
  }

  onSubmitUpdate(id: number, f: NgForm):void {
      this.userService.updateUser(id, f.value).subscribe();
      //window.location.reload();
  }

  onSubmitDelete(id: number):void {
      this.userService.deleteUser(id).subscribe();
       //window.location.reload();
  }

  onSubmitCreate(f: NgForm): void {
    this.userService.createUser(f.value).subscribe()
    this.isEditing = false;
    console.log(this.isEditing);
  }

  ngOnInit(): void {
    this.getUsers();
    this.stationService.getStations()
    .subscribe(stations =>  this.stations = stations);
  }
}
