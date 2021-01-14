import { Component, OnInit } from '@angular/core';
//import {FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule} from '@angular/forms';

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
  control: any;

  //constructor(private userService: UserService, private stationService: StationService, private fb: FormBuilder) {
    constructor(private userService: UserService, private stationService: StationService) {
    /*
    this.control = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      //email: ['', [Validators.required]], //TODO validation
      site: ['', [Validators.required, Validators.minLength(5)]] //TODO validation
    });
    */
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

  onSubmit(type, user, station):void {
    if (!type ){
      this.userService.createUser(user).subscribe();
    }
    else if (type === 'delete'){
      console.log('delete', user, station);
      this.userService.deleteUser(user.id).subscribe();
    }
    else if (type == 'update'){
      console.log('update', user, station);
      this.userService.updateUser(user).subscribe();
      //window.location.reload();
    }
  }
  
  createUser(user): void {
    this.userService.createUser(user).subscribe();
  }


  ngOnInit(): void {
    this.getUsers();
    this.stationService.getStations()
    .subscribe(stations =>  this.stations = stations);

  }
}
