import { Component, OnInit } from '@angular/core'
import { User } from '../../../interfaces/user'
import { AuthenticationService } from '../../../_services/authentication.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/_services/shared.service';
import { Radio } from 'src/app/interfaces/radio';
import { WebsocketService } from 'src/app/_services/websocket.service';
import { GlobalConstants } from 'src/app/global-constants';
import { UtilsService } from 'src/app/_services/utils.service';

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
  requireLogin: boolean = GlobalConstants.requireLogin
  isGateway: boolean = GlobalConstants.gateway
  hasGPS: boolean = GlobalConstants.hasGPS
  showVoiceMenuItem: boolean = false

  constructor(
    private authenticationService: AuthenticationService,
    private sharedService: SharedService,
    private router: Router,
    private websocketService: WebsocketService,
    private utils: UtilsService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if (this.currentUser)
      this.admin = this.currentUser.admin

    if (this.utils.isItRuningLocal() && this.utils.isSBitxRadio())
      this.showVoiceMenuItem = true
    else
      this.showVoiceMenuItem = false
  }

  public closeError() {
    this.errorAlert = false;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
    this.admin = false
    this.websocketService.closeConnection()
  }

  ngOnInit(): void {
    this.radio = this.sharedService.radioObj.value
  }
}
