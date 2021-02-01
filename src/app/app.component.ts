import { Component } from '@angular/core';
//import { UserService } from './user.service';
import { Router } from '@angular/router';

import { AuthenticationService } from './_services/authentication.service';
import { User } from './user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  currentUser: User;
  systemStatus: boolean = false; 

  title = 'hermes.radio';
  constructor( private router: Router, private authenticationService: AuthenticationService){
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }



  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
