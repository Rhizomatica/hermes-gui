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
    selectedUser: User;
    control: any;
    uName: string;
    selTest = true;
    cAnsw: boolean = false;
    iAnsw: boolean = true;
    noUser: true;
    passMatch: boolean = true;

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
    onSubmitUpdate(id, f: NgForm): void {
      console.log('⚚ forgotpassword - onSubmitUpdate: ', 'update', f.value);
      this.userService.updateUser(id, f.value).subscribe();
    }

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
