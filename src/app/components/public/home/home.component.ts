import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { User } from 'src/app/interfaces/user';
import { UtilsService } from 'src/app/_services/utils.service';
import { GlobalConstants } from 'src/app/global-constants';
import { Radio } from 'src/app/interfaces/radio';
import { SharedService } from 'src/app/_services/shared.service';
import { WebsocketService } from 'src/app/_services/websocket.service';
import { ThemeService } from 'src/app/_services/theme.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})

export class HomeComponent implements OnInit, OnDestroy {
  [x: string]: any;


  constructor(
     private authenticationService: AuthenticationService,
    private themeService: ThemeService,
    private router: Router,
    private utils: UtilsService,
    private sharedService: SharedService,
    private websocketService: WebsocketService,
  ) {
    this.checkBrowser(utils.detectBrowserName())
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if (this.currentUser)
      this.admin = this.currentUser.admin

    if (GlobalConstants.requireLogin && this.currentUser && !this.websocketService.messages) {
      this.websocketService.startService()
    }

    if (this.utils.isItRuningLocal() && this.utils.isSBitxRadio())
      this.showVoiceCard = true
    else
      this.showVoiceCard = false
  }

  currentUser: User | null = null
  admin: boolean = false
  currentTheme = 'light'
  alertBrowserXP: boolean = false
  showVoiceCard: boolean = false
  isGateway: boolean = GlobalConstants.gateway
  radio!: Radio
  requireLogin: boolean = GlobalConstants.requireLogin
  @Input() radioObj!: Radio
  self = self.location.host
  showAlert: boolean = true
  alertMessage: string = 'Radio data transmiting now... please wait for use the voice mode.'
  hasGPS: boolean = GlobalConstants.hasGPS
  private radioSubscription!: Subscription

  logOff() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
    this.admin = false
    // this.websocketService.closeConnection() --- IGNORE ---
  }

  toggle(): void {
    this.themeService.toggle();
    this.currentTheme = this.themeService.isDark ? 'dark' : 'light';
  }

  checkBrowser(browser: string) {
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
    this.radio.p1_freq = this.radio.p1_freq == '0' || this.radio.p1_freq == null ? '0' : (parseInt(this.radio.p1_freq) / 1000).toString()
  }

  ngOnInit(): void {
    const stored = localStorage.getItem('dark-mode');
    this.currentTheme = stored === '1' ? 'dark' : 'light';

    this.radioSubscription = this.sharedService.radioObj.subscribe(radio => {
      this.radio = radio;
    });
  }

  ngOnDestroy(): void {
    this.radioSubscription?.unsubscribe();
  }
}
