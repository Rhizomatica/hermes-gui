import { Component, OnInit } from '@angular/core'
import { User } from '../../../interfaces/user'
import { CustomError } from '../../../interfaces/customerror'
// import { UserService } from '../../../_services/user.service'
import { AuthenticationService } from '../../../_services/authentication.service';
import { CustomErrorsService } from '../../../_services/custom-errors.service';

@Component({
  selector: 'custom-errors',
  templateUrl: './custom-errors.component.html',
  styleUrls: ['./custom-errors.component.less']
})

export class CustomErrorsComponent implements OnInit {

  currentUser: User
  admin: Boolean
  loading: Boolean = false
  error: String
  errorAlert: Boolean = false
  customErrors: CustomError[]
  visibleArray: any = []

  constructor(
    // private userService: UserService,
    private authenticationService: AuthenticationService,
    private customErrorsService: CustomErrorsService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if (this.currentUser)
      this.admin = this.currentUser.admin
  }

  getCustomErrors() {
    this.loading = true
    this.customErrorsService.getCustomErrors().subscribe(
      (data: any) => {
        this.customErrors = data;
        this.loading = false;
        this.loadVisibleArray(data)
      },
      (err) => {
        this.error = err;
        this.loading = false
        this.errorAlert = true;
      }
    );
  }

  loadVisibleArray(data) {
    this.visibleArray = []
    data.forEach(item => {
      this.visibleArray.push(false)
    });
  }

  viewLog(i) {
    for (let index = 0; index < this.visibleArray.length; index++) {
      this.visibleArray[index] = false
    }

    this.visibleArray[i] = true
  }

  public closeError() {
    this.errorAlert = false;
  }

  ngOnInit(): void {
    this.getCustomErrors()
  }
}
