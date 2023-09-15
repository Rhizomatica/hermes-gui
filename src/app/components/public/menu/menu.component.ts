import { Component, OnInit } from '@angular/core'
import { User } from '../../../interfaces/user'
import { AuthenticationService } from '../../../_services/authentication.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/_services/shared.service';
import { Radio } from 'src/app/interfaces/radio';
import { WebsocketService } from 'src/app/_services/websocket.service';
import { GlobalConstants } from 'src/app/global-constants';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less']
})

export class MenuComponent implements OnInit {

  currentUser: User
  admin: boolean
  loading: boolean = false
  error: string
  errorAlert: boolean = false
  radio: Radio
  generalLogin:boolean = GlobalConstants.generalLogin

  constructor(
    private authenticationService: AuthenticationService,
    private sharedService: SharedService,
    private router: Router,
    private websocketService: WebsocketService
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
    this.admin = false

    if (this.generalLogin && this.websocketService.ws && this.websocketService.ws.OPEN == 1)
      this.websocketService.ws.close()
  }

  ngOnInit(): void {
    this.radio = this.sharedService.radioObj.value
  }
}
