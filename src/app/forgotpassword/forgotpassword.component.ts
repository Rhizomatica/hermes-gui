import { Component, OnInit } from '@angular/core';
import { NgForm} from '@angular/forms';
import { User } from '../user';
import { UserService } from '../_services/user.service';
import { Station } from '../station';
import { StationService } from '../_services/station.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.less']
})
export class ForgotpasswordComponent implements OnInit {

    error = '';
    success = '';
    test = '';
    users: User[];
    stations: Station[];
    selectedUser: User[];
    control: any;
    uName: string;
    selTest: boolean = false;

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

    onBtn(){
      console.log('lalala');
    }

    onSelect(user): void {
      this.selectedUser = user;
      this.selTest = true;
      console.log(this.selTest);
    }

 

    onSubmitUpdate(id, f: NgForm):void {
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
