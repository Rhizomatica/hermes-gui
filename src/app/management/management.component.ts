import { Component, OnInit } from '@angular/core';
import { NgForm} from '@angular/forms';
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

  searchUser: string;
  error = '';
  success = '';
  users: User[];
  stations: Station[];
  selectedUser: User[];
  control: any;
  isadmin = true;
  isEditing = false;
  deleteUser = true;
  updateUser = true;
  newUsername = false;

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

  Alert(param, ): boolean {
      //param=!param;
      return !param;
   }

  deleteAlert() {
    if(this.deleteUser) {
      this.deleteUser = false;
      //console.log(this.deleteUser);
    } else {
      this.deleteUser = true;
      //console.log(this.deleteUser);
    }
   }

   updateAlert() {
    if(this.updateUser) {
      this.updateUser = false;
      //console.log(this.deleteUser);
    } else {
      this.updateUser = true;
      //console.log(this.deleteUser);
    }
   }

   newUser() {
     this.selectedUser = [];
     this.isEditing = true;
     this.newUsername = true;
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
    console.log(f.value);
      this.userService.updateUser(id, f.value).subscribe(
        (res: any) => {
          this.users = res;
        },
        (err) => {
          this.error = err;
        }
      );
      this.updateUser = false;
      this.isEditing = false;
      window.location.reload();
  }

  onSubmitDelete(id: number):void {
      this.userService.deleteUser(id).subscribe();
      this.deleteUser = false;
      this.isEditing = false;
      window.location.reload();
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
