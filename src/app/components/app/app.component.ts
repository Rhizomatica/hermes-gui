import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivationEnd } from '@angular/router';
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
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Observable, Subscribable } from 'rxjs';
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

export class AppComponent implements OnInit, OnDestroy {
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
  currentPage = GlobalConstants.generalLogin ? "login" : 'home'
  currentUrl = GlobalConstants.generalLogin ? "login" : 'home'
  received = [];
  sent = [];
  content = ''
  idleState = "NOT_STARTED";
  countdown?: number = null
  isLoginPage: boolean = null
  emergencyEmail = GlobalConstants.emergencyEmail
  routerObserver = null

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private apiService: ApiService,
    private radioService: RadioService,
    private utils: UtilsService,
    private location: Location,
    private websocketService: WebsocketService,
    private sharedService: SharedService,
    private idle: Idle,
    // private keepalive: Keepalive, 
    private cd: ChangeDetectorRef
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

    this.startIdleDetector()
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
    this.idle.setIdle(600)
    this.idle.setTimeout(30)
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
      this.resetIdle();
      this.authenticationService.logout();
      this.router.navigate(['/login']);
      this.websocketService.closeConnection()
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
    this.radio = this.sharedService.radioObj.value

    this.routerObserver = this.router.events.subscribe((event) => {
      if (event instanceof ActivationEnd) {

        //Redirect login if reload page...
        if (!this.router.navigated && this.router.url !== '/login' && this.router.url !== '/languages' && this.router.url !== '/languages' && this.router.url !== '/home' ) {
          this.router.navigate(['home'])
        }
      }

      if (event instanceof NavigationEnd) {

        this.checkIsMenuPage()
        this.checkIsLoginPage()
        this.updateBreadcrumb()

        if (!GlobalConstants.generalLogin && !this.websocketService.messages) {
          this.websocketService.startService()
        }
      }

    });
  }

  ngOnDestroy() {
    this.routerObserver.unsubscribe();
  }
}