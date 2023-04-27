import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_services/api.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { UtilsService } from 'src/app/_services/utils.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.less']
})
export class LandingComponent implements OnInit {


  constructor(
    private authenticationService: AuthenticationService,
    private apiService: ApiService,
    private utils: UtilsService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if (this.currentUser)
      this.admin = this.currentUser.admin
  }

  currentUser: User = null
  admin: boolean = false

  ngOnInit(): void {


  }
}
