import { Component, OnInit } from '@angular/core';

import { User } from '../user';
import { AuthenticationService } from '../authentication.service';


@Component({
  selector: 'app-sysadmin',
  templateUrl: './sysadmin.component.html',
  styleUrls: ['./sysadmin.component.less']
})
export class SysadminComponent implements OnInit {
  currentUser:User;

  constructor( private authenticationService: AuthenticationService){
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }


  ngOnInit(): void {
  }

}
