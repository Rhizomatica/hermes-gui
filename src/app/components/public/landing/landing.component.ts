import { Component, OnInit, Input } from '@angular/core';
import { AlertService } from '../../../_services/alert.service';
import { User } from '../../../interfaces/user';
import { UserService } from '../../../_services/user.service';
import { AuthenticationService } from '../../../_services/authentication.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.less']
})
export class LandingComponent implements OnInit {

  // @Input() message: Message;
  currentUser: User;
  error = Error;
  success = '';
  test = '';
  
  constructor(
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    private userService: UserService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }
  
  ngOnInit(): void {
    console.log("LANDING PAGE LOADED");
  }
}
