import { Component, OnInit } from '@angular/core';
import { NgForm} from '@angular/forms';
import { User } from '../../../interfaces/user';
import { UserService } from '../../../_services/user.service';
import { Station } from '../../../interfaces/station';
import { StationService } from '../../../_services/station.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.less']
})
export class ForgotpasswordComponent implements OnInit {

    error = Error;
    success = false;
    test = '';
    users: User[];
    stations: Station[];
    selectedUser: User;
    control: any;
    uName: string;
    selTest = true;
    cAnsw = false;
    iAnsw = true;
    noUser: true;
    passMatch = true;
    errorAlert = false;
    sucess = false;
    answ: string;



    constructor(private userService: UserService, private stationService: StationService) { }

    getUsers(): void {
      this.userService.getUsers().subscribe(
        (res: any) => {
          this.users = res;
          console.log(this.users);
        },
        (err) => {
          this.error = err;
          this.errorAlert = true;
        }
      );
    }

    onBtn(){
      // console.log('debug onBtn lalala');
    }

    onSelect(input): void {
      this.selectedUser = this.users.find(obj => {
        return obj.email === input;
      });
      if (typeof(this.selectedUser) === 'undefined') {
        this.selTest = false;
      } else {
        this.selTest = true;
      }
    }

    onSubmitUpdate(f: NgForm): void {
      console.log('⚚ management - passreset ');
      const id = this.selectedUser.emailid;
      this.userService.updateUser(id, f.value).subscribe(
        (res: any) => {
          this.users = res;
          this.success = true;

        },
        (err) => {
          this.error = err;
          this.errorAlert = true;
          this.success = false;
        }
      );
      // window.location.reload();
    }

    closeError() {
      this.errorAlert = false;
    }

    checkAnswer(id, answ) {
      this.userService.recoverPassword(id, answ)
        .subscribe(
        (res: any) => {
          this.cAnsw = true;
        },
        (err) => {
          this.error = err;
          this.errorAlert = true;
        }
      );
    }



    checkPassw(passw, repassw) {
      if (passw === repassw) {
        this.passMatch = true;

      } else {
        this.passMatch = false;
      }
    }


    ngOnInit(): void {
      this.getUsers();
      this.stationService.getStations()
      .subscribe(stations =>  this.stations = stations);
    }
  }