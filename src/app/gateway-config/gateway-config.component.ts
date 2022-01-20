import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { AuthenticationService } from '../_services/authentication.service';
import { ApiService } from '../_services/api.service';

@Component({
  selector: 'app-gateway-config',
  templateUrl: './gateway-config.component.html',
  styleUrls: ['./gateway-config.component.less']
})
export class GatewayConfigComponent implements OnInit {

  currentUser: User;
  isAdmin = true;
  enabled = true;

  constructor(
    private authenticationService: AuthenticationService,
    private apiService: ApiService) {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }



  ngOnInit(): void {
    console.log('⚚ sysadmin - onInit currentUser: ', this.currentUser);
    if (this.currentUser) {
      this.isAdmin = this.currentUser.admin;
    } else {
      this.isAdmin = false;
    }
  }

}
