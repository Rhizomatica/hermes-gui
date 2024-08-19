import { Component, OnInit, HostListener, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivationEnd, NavigationEnd, Router } from '@angular/router';
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
  deferredPrompt: any
  installPromotion: boolean = false
  title = 'hermes.radio'
  isMenuPage: boolean
  currentPage = GlobalConstants.requireLogin ? "login" : 'home'
  currentUrl = GlobalConstants.requireLogin ? "login" : 'home'
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

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e) {
    console.log("Service Worker is started")
    // Impede que o mini-infobar apareça em mobile
    e.preventDefault();
    this.deferredPrompt = e;
    if (!this.deferredPrompt) {
      this.showInstallPromotion();
    }
    console.log(`'beforeinstallprompt' event was fired.`);
  }

  showInstallPromotion() {
    console.log("deferred" + this.deferredPrompt)
    this.installPromotion = true
  }

  closeInstallapp() {
    this.installPromotion = false
  }

  installPWA(): void {
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        this.deferredPrompt = null;
      });
  }

  hideInstallPromotion() {
    if (!this.deferredPrompt) {
      this.deferredPrompt = null;
    }
  }
  checkIsLoginPage() {
    this.isLoginPage = this.router.url == '/login' ? true : false
  }

  updateBreadcrumb() {
    this.currentPage = this.router.url.split("/")[1]
    this.currentUrl = this.router.url
  }

  checkRequireLogin() {
    GlobalConstants.requireLogin == true && this.currentUser == null ? this.router.navigate(['/login']) : null;
  }

  disableNavigationsRequireLoginNoUser() {
    if (GlobalConstants.requireLogin && this.currentUser == null) {
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

      if (GlobalConstants.requireLogin)
        this.router.navigate(['/login']);

      if (!GlobalConstants.requireLogin)
        this.router.navigate(['/home']);

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
    this.checkRequireLogin()
    this.getSystemStatus();
    this.utils.isMobile()
    this.checkLanguage()
    this.radio = this.sharedService.radioObj.value

    this.routerObserver = this.router.events.subscribe((event) => {
      if (event instanceof ActivationEnd) {

        //Redirect login if reload page...
        if (!this.router.navigated && this.router.url !== '/login' && this.router.url !== '/languages' && this.router.url !== '/languages' && this.router.url !== '/home') {
          this.router.navigate(['home'])
        }
      }

      if (event instanceof NavigationEnd) {

        this.checkIsMenuPage()
        this.checkIsLoginPage()
        this.updateBreadcrumb()

        if (!GlobalConstants.requireLogin && !this.websocketService.messages) {
          this.websocketService.startService()
        }
      }
    });

    window.addEventListener('appinstalled', () => {
      // Esconder a promoção de instalação fornecida pela app
      this.hideInstallPromotion();
      // Limpar o deferredPrompt para que seja coletado
      this.deferredPrompt = null;
      console.log('PWA was installed');
    });
  }

  ngOnDestroy() {
    this.routerObserver.unsubscribe();
  }
}