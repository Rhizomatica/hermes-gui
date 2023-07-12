import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DecimalPipe, Location } from '@angular/common';
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
  frequency: Number = 0
  frequencyMode: String = null
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
    private sharedService: SharedService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    // router.events.subscribe((val) => {
    //     this.chackIsMenuPage()
    // });

    router.events.subscribe((val) => {
      // see also
      if (val instanceof NavigationEnd) {
        this.chackIsMenuPage()
        this.updateBreadcrumb()
      }
    });

    //Run Websocket to listen PTT if app is runing local (station)
    // if (utils.isItRuningLocal() && utils.isSBitxRadio()) {

    websocketService.messages.subscribe(data => {

      this.radioObj = {
        irxs: 4,
        freq: 7010000,
        mode: 'USB',
        protection: 'off' // TODO - Change this one to bit or boolean?
      }


      // this.sharedService.radioObj.subscribe({
      //   next: newValue => this.radioObj
      // });

      this.sharedService.radioObj.value.frequency = this.radioObj.freq;


      // TODO ------------------------------------

      // 1 - Sugerir obter todos esses dados (radio config)
      // { 
      //   "tx": true, 
      //   "rx": false, 
      //   "led": false, 
      //   "fwd_raw": "", 
      //   "fwd_volts": 0, 
      //   "fwd_watts": 0, 
      //   "swr": 0, 
      //   "ref_raw": "", 
      //   "ref_volts": 0, 
      //   "ref_watts": 0, 
      //   "protection": false, 
      //   "connection": false 
      // }

      // 2 - Se obter ptt Hardware mode nevegar para voice conferir se esta usando hardware
      // 3 - Atualizar dados interface
      // 4 - Botao Controle de frequencia 
      // 5 - Tornar essas informacoes globais de facil acesso
      // 6 - Refatorar codigo
      // 7 - Enviar JSON do servidor


    }, err => {
      console.log("err" + err)

    }, () => {
      console.log('complete, closing connection...')
    })
    // }
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

  getRadioStatus(): void {
    this.radioService.getRadioStatus().subscribe(
      (res: any) => {
        this.radio = res;
        this.protection = this.radio.protection;
        this.frequency = this.radio.freq == '' || this.radio.freq == null ? 0 : this.radio.freq / 1000
        this.frequencyMode = this.radio.mode;
        this.loading = false;
        return res;
      },
      (err) => {
        this.error = err;
        this.radioError = true;
        this.loading = false;
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
    !localStorage.getItem('language') ? this.router.navigate(['/languages'])
      : null;
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
    this.getRadioStatus();
    this.mobile = this.utils.isMobile()
    this.checkLanguage()
  }
}
