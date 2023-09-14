import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
import { CustomError } from 'src/app/interfaces/customerror';
import { interval } from 'rxjs';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
// import { Keepalive } from '@ng-idle/keepalive';

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
  isMenuPage: boolean
  currentPage = 'home'
  currentUrl = '/home'
  received = [];
  sent = [];
  content = ''
  radioObj: Radio
  intervallTimerKeepWebSocketAlive = interval(900)
  idleState = "NOT_STARTED";
  countdown?: number = null
  isLoginPage: boolean = null

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private apiService: ApiService,
    private radioService: RadioService,
    private utils: UtilsService,
    private location: Location,
    private websocketService: WebsocketService,
    private sharedService: SharedService,
    private errorService: CustomErrorsService,
    private idle: Idle,
    // private keepalive: Keepalive, 
    private cd: ChangeDetectorRef
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

    this.startIdleDetector()

    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.checkIsMenuPage()
        this.checkIsLoginPage()
        this.updateBreadcrumb()


        if (GlobalConstants.generalLogin && this.currentUser && !this.websocketService.messages) {
          this.websocketService.startService()
          this.startWebSocketService()
        }

        if (!GlobalConstants.generalLogin && !this.websocketService.messages) {
          this.websocketService.startService()
          this.startWebSocketService()
        }
      }
    });
  }

  startWebSocketService() {

    this.sharedService.radioObj.subscribe({
      next: newValue => this.radioObj
    });

    this.websocketService.messages.subscribe(data => {
      this.sharedService.setRadioObjShared(data)

      this.radio = this.sharedService.radioObj.value

      this.checkingPTTHardwareCommand()

    }, async err => {

      this.saveWebsocketError()
      if (this.websocketService.ws.OPEN)
        this.websocketService.ws.close()

      this.keepWebSocketAlive()

      if (self.location.hostname === 'hermes.radio')
        this.sharedService.mountRadioObjDemo()

    }, () => {
      console.log('complete, closing websocket connection...')
    })
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

  async saveWebsocketError(): Promise<void> {

    var newError: CustomError = {
      controller: 'websocket',
      error_code: 500,
      error_message: 'Error to connect on websocket service',
      stacktrace: null,
      created_at: new Date().toString(),
      updated_at: new Date().toString()
    }

    this.loading = true
    await this.errorService.newCustomError(newError).subscribe(
      (res: any) => {
        this.loading = false
      }, (err) => {
        this.loading = false
      }
    );
  }

  keepWebSocketAlive() {
    console.log('keep alive...')
    if (!this.websocketService.ws.OPEN) {
      this.intervallTimerKeepWebSocketAlive.subscribe(() => {
        this.websocketService.startService()
        this.startWebSocketService()
      });
    }
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

  checkingPTTHardwareCommand() {
    if (this.utils.isItRuningLocal() && this.utils.isSBitxRadio() && this.radio.ptt) {
      this.router.navigate(['/voice'])
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

  onActivate(event) {
    window.scrollTo(0, 0)
  }

  checkLanguage() {
    !localStorage.getItem('language') ? this.router.navigate(['/languages']) : null;
  }

  closeMobileMenu() {
    this.location.back();
  }

  checkIsMenuPage() {
    this.isMenuPage = this.router.url == '/menu' ? true : false
  }

  checkIsLoginPage() {
    this.isLoginPage = this.router.url == '/login' ? true : false
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

  startIdleDetector() {
    this.idle.setIdle(10)
    this.idle.setTimeout(5)
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES)

    this.idle.onIdleStart.subscribe(() => {
      this.idleState = "IDLE";
    })

    // do something when the user is no longer idle
    this.idle.onIdleEnd.subscribe(() => {
      this.idleState = "NOT_IDLE"
      this.countdown = null;
      this.cd.detectChanges() // how do i avoid this kludge?
    })

    // do something when the user has timed out
    this.idle.onTimeout.subscribe(() => {
      this.idleState = "TIMED_OUT"
      this.authenticationService.logout();
      // right when the component initializes, start reset state and start watching
      this.resetIdle();

      if (GlobalConstants.generalLogin && this.websocketService.ws.OPEN)
        this.websocketService.ws.close()

      this.router.navigate(['/login']);
    })

    // do something as the timeout countdown does its thing
    this.idle.onTimeoutWarning.subscribe(seconds => {
      this.countdown = seconds
    });

    this.idle.watch()
  }

  resetIdle() {
    // we'll call this method when we want to start/reset the idle process
    // reset any component state and be sure to call idle.watch()
    this.idle.watch();
    this.idleState = "NOT_IDLE";
    this.countdown = null;
  }

  ngOnInit(): void {
    console.log('⚚ HERMES RADIO ⚚');
    this.loading = true
    this.checkGeneralLogin()
    this.getSystemStatus();
    this.utils.isMobile()
    this.checkLanguage()
  }
}