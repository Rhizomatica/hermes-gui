import { Component, OnInit } from '@angular/core';
import { NgForm} from '@angular/forms';
import { User } from '../user';
import { UserService } from '../user.service';
import { Station } from '../station';
import { StationService } from '../station.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})


export class UserComponent implements OnInit {

  error = '';
  success = '';
  test = '';
  users: User[];
  stations: Station[];
  selectedUser: User[];
  control: any;


    constructor(private userService: UserService, private stationService: StationService) {

  }

 loggedin(): void {
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
  }

  onSubmitUpdate(id: number, f: NgForm):void {
      console.log('update', f.value);
      this.userService.updateUser(id, f.value).subscribe();
      //window.location.reload();
  }

  onSubmitDelete(id):void {
    console.log(id);
        this.userService.deleteUser(id).subscribe();
        //window.location.reload();
  }


  createUser(f: NgForm): void {
    this.userService.createUser(f.value).subscribe();
  }


  ngOnInit(): void {
    this.getUsers();
    this.stationService.getStations()
    .subscribe(stations =>  this.stations = stations);
    
  
  }
}