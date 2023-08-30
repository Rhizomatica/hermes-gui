import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { DarkModeService, DARK_MODE_OPTIONS } from 'angular-dark-mode';
import { User } from 'src/app/interfaces/user';
import { UtilsService } from 'src/app/_services/utils.service';
import { GlobalConstants } from 'src/app/global-constants';
import { Radio } from 'src/app/interfaces/radio';
import { SharedService } from 'src/app/_services/shared.service';
import { WebsocketService } from 'src/app/_services/websocket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})

export class homeComponent implements OnInit {
  [x: string]: any;


  constructor(
    private authenticationService: AuthenticationService,
    private darkModeService: DarkModeService,
    private router: Router,
    private utils: UtilsService,
    private sharedService: SharedService,
    private websocketService: WebsocketService
  ) {
    this.checkBrowser(utils.detectBrowserName())
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if (this.currentUser)
      this.admin = this.currentUser.admin

    if (utils.isItRuningLocal() && utils.isSBitxRadio())
      this.showVoiceCard = false
  }

  currentUser: User = null
  admin: boolean = false
  darkMode$: Observable<boolean> = this.darkModeService.darkMode$;
  currentTheme = 'light'
  alertBrowserXP: Boolean = false
  showVoiceCard: Boolean = true
  isGateway: boolean = GlobalConstants.gateway
  radio: Radio

  @Input() radioObj: Radio

  logOff() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
    this.admin = false
    this.websocketService.ws.close()
  }

  toggle(): void {
    if (this.currentTheme == 'light') {
      this.currentTheme = 'dark'
      this.darkModeService.toggle();
      return
    }

    if (this.currentTheme == 'dark') {
      this.currentTheme = 'light'
      this.darkModeService.toggle();
      return
    }
  }

  checkBrowser(browser) {
    var browserWarning = localStorage.getItem('browserWarning');

    if (browserWarning === null && browser !== 'chrome') {
      localStorage.setItem('browserWarning', 'true');
      this.alertBrowserXP = true
    }
  }

  closeBrowserAlert() {
    this.alertBrowserXP = false
  }

  formatFrequency() {
    this.radio.freq = this.radio.freq == 0 || this.radio.freq == null ? 0 : this.radio.freq / 1000
  }

  // ngOnChanges(change) {
  //   change.radioObj && change.radioObj.currentValue != change.radioObj.previousValue ? this.radio = change.radioObj.currentValue : null
  //   this.radio = change.radioObj.value
  //   this.formatFrequency()
  //   this.loading = false
  // }

  ngOnInit(): void {
    this.currentTheme = JSON.parse(localStorage.getItem('dark-mode')).darkMode == true ? 'dark' : 'light';
    this.radio = this.sharedService.radioObj.value
  }
}
