import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DecimalPipe, Location, NgSwitchCase } from '@angular/common';
import { AuthenticationService } from '../../_services/authentication.service';
import { ApiService } from '../../_services/api.service';
import { User } from '../../interfaces/user';
import { RadioService } from '../../_services/radio.service';
import { UtilsService } from '../../_services/utils.service';
import { WebsocketService } from 'src/app/_services/websocket.service';
import { GlobalConstants } from 'src/app/global-constants';
import { DarkModeService } from 'angular-dark-mode';
import { SharedService } from 'src/app/_services/shared.service';
import { Radio } from 'src/app/interfaces/radio';
import { CustomErrorsService } from 'src/app/_services/custom-errors.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  providers: [DecimalPipe,
    WebsocketService,
    { provide: '_serviceRoute', useValue: 'websocket' }
  ]
})

export class AppComponent implements OnInit {
  currentUser: User;
  serverRes: any;
  error: any;
  system: any;
  fullStats = false;
  serverError = false;
  radio: any;
  protection = true;
  radioError = false;
  res: any;
  errorAlert = false;
  resetting = false;
  subscript: any;
  loading = true;
  changeLanguage = false
  title = 'hermes.radio'
  mobile: any
  isMenuPage: boolean
  currentPage = 'home'
  currentUrl = '/home'
  received = [];
  sent = [];
  content = '';
  radioObj: Radio

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private apiService: ApiService,
    private radioService: RadioService,
    private utils: UtilsService,
    private location: Location,
    private websocketService: WebsocketService,
    private sharedService: SharedService,
    private errorService: CustomErrorsService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

    router.events.subscribe((val) => {
      // see also
      if (val instanceof NavigationEnd) {
        this.chackIsMenuPage()
        this.updateBreadcrumb()
      }
    });

    this.startWebSocketService()
  }

  startWebSocketService() {
    //Run Websocket to listen PTT if app is runing local (station)
    // if (utils.isItRuningLocal() && utils.isSBitxRadio()) {

    this.sharedService.radioObj.subscribe({
      next: newValue => this.radioObj
    });

    this.websocketService.messages.subscribe(data => {
      this.checkWSObjectType(data)
      this.radio = this.sharedService.radioObj.value
    }, err => {

      //Pegar variavel erro para visualizar oq vem ....
      var newError = {
        controller: 'websocket',
        error_code: '500',
        error_message: 'Error to retrieve data from websocket service',
        stacktrace: err,
        station: GlobalConstants.domain,
        created_at: new Date()
      }

      this.errorService.newCustomError(err)

    }, () => {
      console.log('complete, closing websocket connection...')
    })
  }


  checkWSObjectType(data) {
    switch (data.type) {
      case 0:
        this.mountObjectTypeZero(data)
      case 1:
        this.mountObjectTypeOne(data)
    }
  }

  mountObjectTypeZero(data) {
    this.sharedService.radioObj.value.fwd_watts = data.fwd_watts
    this.sharedService.radioObj.value.freq = data.freq
    this.sharedService.radioObj.value.swr = data.swr
    this.sharedService.radioObj.value.protection = data.protection
  }

  mountObjectTypeOne(data) {
    this.sharedService.radioObj.value.freq = this.utils.formatFrequency(data.freq)
    this.sharedService.radioObj.value.mode = data.mode
    this.sharedService.radioObj.value.tx = data.tx
    this.sharedService.radioObj.value.rx = data.rx
  }

  sendMsg() {
    let message = {
      source: '',
      content: ''
    };

    message.source = 'localhost';
    message.content = this.content;

    this.sent.push(message);
    this.websocketService.messages.next(message);
  }

  getSystemStatus(): void {
    this.apiService.getStatus().subscribe(
      (res: any) => {
        this.system = res;
        this.system.domain = this.system.domain == "hermes.radio" ? "demo.hermes.radio" : this.system.domain
        this.loading = false
      },
      (err) => {
        this.error = err;
        this.loading = false
      }
    );
  }

  resetProtection() {
    if (this.resetting === true) {
      this.resetting = false;
    } else {
      this.resetting = true;
    }
  }

  confirmReset() {
    this.radioService.radioResetProtection().subscribe(
      (res: any) => {
        this.res = res;
        if (this.res === 1) {
          this.radio.protection = true;
          this.protection = this.radio.protection;
        }
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

  showServerAlert() {
    if (!this.serverError) {
      this.serverError = true;
    } else {
      this.serverError = false;
    }
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
    this.currentUser = null;
  }

  onActivate(event) {
    window.scrollTo(0, 0)
  }

  checkLanguage() {
    !localStorage.getItem('language') ? this.router.navigate(['/languages']) : null;
  }

  closeMobileMenu() {
    this.location.back();
  }

  chackIsMenuPage() {
    this.isMenuPage = this.router.url == '/menu' ? true : false
  }

  updateBreadcrumb() {
    this.currentPage = this.router.url.split("/")[1]
    this.currentUrl = this.router.url
  }

  checkGeneralLogin() {
    GlobalConstants.generalLogin == true && this.currentUser == null ? this.router.navigate(['/login']) : null;
  }

  disableNavigationsGeneralLoginNoUser() {
    if (GlobalConstants.generalLogin && this.currentUser == null) {
      return true
    }
    return false
  }

  ngOnInit(): void {
    this.checkGeneralLogin()
    this.loading = true
    console.log('⚚ HERMES RADIO ⚚');
    this.getSystemStatus();
    this.mobile = this.utils.isMobile()
    this.checkLanguage()
  }
}
