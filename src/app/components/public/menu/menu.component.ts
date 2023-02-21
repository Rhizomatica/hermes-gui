import { Component, OnInit } from '@angular/core'
import { User } from '../../../interfaces/user'
import { CustomError } from '../../../interfaces/customerror'
// import { UserService } from '../../../_services/user.service'
import { AuthenticationService } from '../../../_services/authentication.service';
import { CustomErrorsService } from '../../../_services/custom-errors.service';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less']
})

export class MenuComponent implements OnInit {

  currentUser: User
  admin: Boolean
  loading: Boolean = false
  error: String
  errorAlert: Boolean = false

  constructor(
    // private userService: UserService,
    private authenticationService: AuthenticationService,
    private customErrorsService: CustomErrorsService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if (this.currentUser)
      this.admin = this.currentUser.admin
  }


  public closeError() {
    this.errorAlert = false;
  }

  ngOnInit(): void {

  }
}
