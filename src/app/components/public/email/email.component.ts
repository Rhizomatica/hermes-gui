import { Component, OnInit } from '@angular/core';
import { User } from '../../../interfaces/user';
import { UserService } from '../../../_services/user.service';
import { AuthenticationService } from '../../../_services/authentication.service';
import { ApiService } from '../../../_services/api.service';
import { GlobalConstants } from 'src/app/global-constants';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.less']
})

export class EmailComponent implements OnInit {

  linksOn = false;
  currentUser: User;
  error = Error;
  errorAlert = false;
  emailto = [];
  users: any;
  domain: String
  emergencyEmail: String

  constructor(
    private authenticationService: AuthenticationService,
    private apiService: ApiService,
    private userService: UserService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.emergencyEmail = GlobalConstants.emergencyEmail
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(
      (res: any) => {
        this.users = res;
        for (let i = 0; i < Object.keys(this.users).length; i++) {
          this.users[i].fullmail = this.users[i].email + '@' + GlobalConstants.domain;
        }
      }), (err) => {
        this.error = err;
        this.errorAlert = true;
      };
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

  closeError() {
    this.errorAlert = false;
  }

  ngOnInit(): void {
    this.getUsers();
  }
}
