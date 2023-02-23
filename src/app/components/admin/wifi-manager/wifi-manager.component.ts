import { Component, OnInit } from '@angular/core'
import { User } from '../../../interfaces/user'
import { CustomError } from '../../../interfaces/customerror'
// import { UserService } from '../../../_services/user.service'
import { AuthenticationService } from '../../../_services/authentication.service';
import { WifiManagerService } from '../../../_services/wifi-manager.service';

@Component({
  selector: 'wifi-manager',
  templateUrl: './wifi-manager.component.html',
  styleUrls: ['./wifi-manager.component.less']
})

// https://randomnerdtutorials.com/esp32-wi-fi-manager-asyncwebserver/


export class WifiManagerComponent implements OnInit {

  currentUser: User
  admin: Boolean
  loading: Boolean = false
  error: String
  errorAlert: Boolean = false
  wifi: any //CREATE MODEL?

  constructor(
    // private userService: UserService,
    private authenticationService: AuthenticationService,
    private wifiManagerService: WifiManagerService
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
