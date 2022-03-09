import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../_services/user.service';
import { AuthenticationService } from '../_services/authentication.service';
import { ApiService } from '../_services/api.service';


@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.less']
})
export class EmailComponent implements OnInit {

  linksOn = false;
  currentUser: User;
  users: User[];
  error = Error;
  errorAlert = false;
  emailto = [];
  system: any;


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
        console.log(this.users);
        
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

  getSystemStatus(): void{
    this.apiService.getStatus().subscribe(
      (res: any) => {
        this.system = res;
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
