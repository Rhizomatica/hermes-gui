import { Component, OnInit } from '@angular/core'
import { User } from '../../../interfaces/user'
import { CustomError } from '../../../interfaces/customerror'
// import { UserService } from '../../../_services/user.service'
import { AuthenticationService } from '../../../_services/authentication.service';
import { CustomErrorsService } from '../../../_services/custom-errors.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/_services/shared.service';
import { Radio } from 'src/app/interfaces/radio';

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
  radio: Radio

  constructor(
    private authenticationService: AuthenticationService,
    private sharedService: SharedService,
    private router: Router,
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if (this.currentUser)
      this.admin = this.currentUser.admin
  }


  public closeError() {
    this.errorAlert = false;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
    this.currentUser = null;
  }
  
  ngOnInit(): void {
    this.radio = this.sharedService.radioObj.value
  }
}
