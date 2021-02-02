import { Component } from '@angular/core';
//import { UserService } from './user.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthenticationService } from './_services/authentication.service';
import { ApiService } from './_services/api.service';

import { User } from './user';
import { Api } from './api';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  currentUser: User;
  serverRes: any;
  error: any;
  public system: any;

  title = 'hermes.radio';
  constructor(
     private router: Router,
     private authenticationService: AuthenticationService,
     private apiService: ApiService
    ){
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  getSystemStatus(): void{
    this.apiService.getStatus().subscribe(
      (res: any) => {
        this.system = res;
        return res;
      },
      (err) => {
        this.error = err;
      }
    );
  }


  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
    this.currentUser = null;
  }

  ngOnInit(): void {
     this.getSystemStatus();
  }
}
