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

    error = Error;
    success: boolean = false;
    test = '';
    users: User[];
    stations: Station[];
    selectedUser: User;
    control: any;
    uName: string;
    selTest = true;
    cAnsw: boolean = false;
    iAnsw: boolean = true;
    noUser: true;
    passMatch: boolean = true;
    errorAlert: boolean = false;
    sucess: boolean = false;


    constructor(private userService: UserService, private stationService: StationService) { }

    getUsers(): void {
      this.userService.getUsers().subscribe(
        (res: any) => {
          this.users = res;
        },
        (err) => {
          this.error = err;
          this.errorAlert = true;
        }
      );
    }

    onBtn(){
      //console.log('debug onBtn lalala');
    }

    onSelect(input): void {
      this.selectedUser = this.users.find(obj => {
        return obj.email === input
      });
      if (typeof(this.selectedUser) == 'undefined') {
        this.selTest = false;
        //console.log('⚚ forgotpassword - onSelect: ','titit');
      } else {
        this.selTest = true;
        //console.log('⚚ forgotpassword: -onSelect: ','toooo');
      }
      //this.selectedUser = user;

      //console.log('⚚ forgotpassword - onSelect: input: ',input);
      //console.log('⚚ forgotpassword - onSelect: users: ',this.users);
      //console.log('⚚ forgotpassword - onSelect: selecteduser: ',this.selectedUser);

    }

    onSubmitUpdate(f:NgForm): void {
      console.log('⚚ management - passreset ');
      var id = this.selectedUser.emailid;
      

      this.userService.updateUser(id, f.value).subscribe(
        (res: any) => {
          this.users = res;
          this.success = true;
          console.log(this.success);
        },
        (err) => {
          this.error = err;
          this.errorAlert = true;
          this.success = false;


        }
      );
      //window.location.reload();
    }
  
    closeError() {
      this.errorAlert = false;
    }

    checkAnswer(answ) {
      if (this.selectedUser.recoveranswer === answ) {
        this.cAnsw = true;
        this.iAnsw = true;
      } else {
        this.cAnsw = false;
        this.iAnsw = false;
      }
    }

    //TODO CH alterar a senha


    checkPassw(passw, repassw) {
      if (passw == repassw) {
        this.passMatch = true;

      } else {
        this.passMatch = false
      }
    }


    ngOnInit(): void {
      this.getUsers();
      this.stationService.getStations()
      .subscribe(stations =>  this.stations = stations);
    }
  }
