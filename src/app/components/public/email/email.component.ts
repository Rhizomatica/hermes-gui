import { Component, OnInit } from '@angular/core';
import { User } from '../../../interfaces/user';
import { UserService } from '../../../_services/user.service';
import { AuthenticationService } from '../../../_services/authentication.service';
import { ApiService } from '../../../_services/api.service';


@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.less']
})
export class EmailComponent implements OnInit {

  linksOn = false;
  currentUser: User;
  users: any;
  error = Error;
  errorAlert = false;
  emailto = [];
  system: any;
  domain: string;


  constructor(
    private userService: UserService,
      private authenticationService: AuthenticationService,
      private apiService: ApiService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

   }

   getUsers(): void {
    this.userService.getUsers().subscribe(
      (res: any) => {
        this.users = res;

       let count = Object.keys(this.users).length;
      console.log(Object.keys(this.users).length);
        for (let i = 0; i < Object.keys(this.users).length; i++) {
          this.users[i].fullmail = this.users[i].email + this.domain;
          console.log(this.users[i].fullmail);

        }
   
        }),(err) => {
          this.error = err;
          this.errorAlert = true;
        };
        console.log(this.users);
  }

  getSystemStatus(): void{
    this.apiService.getStatus().subscribe(
      (res: any) => {
        this.system = res;
        this.domain = '@' + this.system.domain;
        this.getUsers();
      },
      (err) => {
        this.error = err;
      
      }
    );
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = items => {
      items.forEach(element => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };
    allSelect(items);
  }

  showlinks() {
  if (this.linksOn == true) {
    this.linksOn = false
  } else {
    this.linksOn = true;
  }



}

  ngOnInit(): void {
    this.getUsers();
    this.getSystemStatus();
   // console.log(this.users);
  }

}
