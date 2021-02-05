import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-sysadmin',
  templateUrl: './sysadmin.component.html',
  styleUrls: ['./sysadmin.component.less']
})
export class SysadminComponent implements OnInit {
  currentUser: User;
  isAdmin = true;

  constructor( private authenticationService: AuthenticationService){
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit(): void {
    console.log(this.currentUser);
    if (this.currentUser) {
      this.isAdmin = this.currentUser.admin;
    } else {
      this.currentUser.admin = false;
    }
  }

}
