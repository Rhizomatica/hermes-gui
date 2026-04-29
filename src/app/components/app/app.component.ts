import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DecimalPipe, Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../_services/authentication.service';
import { ApiService } from '../../_services/api.service';
import { User } from '../../interfaces/user';
import { RadioService } from '../../_services/radio.service';
import { UtilsService } from '../../_services/utils.service';
import { WebsocketService } from 'src/app/_services/websocket.service';
import { GlobalConstants } from 'src/app/global-constants';
import { SharedService } from 'src/app/_services/shared.service';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { ThemeService } from 'src/app/_services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  providers: [
    DecimalPipe,
    WebsocketService,
    { provide: '_serviceRoute', useValue: 'websocket' }
  ]
})

export class AppComponent implements OnInit, OnDestroy {
  currentUser: User | undefined;
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
  isMenuPage: boolean | null = null
  currentPage = GlobalConstants.requireLogin ? "login" : 'home'
  currentUrl = GlobalConstants.requireLogin ? "login" : 'home'
  received: Array<{ source: string; content: string }> = [];
  sent: Array<{ source: string; content: string }> = [];
  content = ''
  idleState = "NOT_STARTED";
  countdown?: number | null = null
  isLoginPage: boolean | null = null
  emergencyEmail = GlobalConstants.emergencyEmail
  routerObserver: Subscription | null = null
  localeId = GlobalConstants.localeId
  private radioSubscription!: Subscription

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
    private cd: ChangeDetectorRef,
    private theme: ThemeService
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
    this.apiService.getStatus().subscribe({
      next: (res: any) => {
        this.system = res;
        this.system.domain = this.system.domain == "hermes.radio" ? "demo.hermes.radio" : this.system.domain
        this.loading = false
      },
      error: (err) => {
        this.error = err;
        this.loading = false
      }
    });
  }

  showServerAlert() {
    if (!this.serverError) {
      this.serverError = true;
    } else {
      this.serverError = false;
    }
  }

  onActivate() {
    window.scrollTo(0, 0)
  }

  checkLanguage() {
    const validCodes = ['pt', 'es', 'fr', 'ar', 'en-US'];
    const currentLocale = window.location.pathname.split('/')[1];
    const isLocaleUrl = validCodes.includes(currentLocale);
    let stored = localStorage.getItem('language');

    if (!stored) {
      // Detect locale from URL (production), fall back to app default
      const detected = isLocaleUrl ? currentLocale : GlobalConstants.localeId;
      localStorage.setItem('language', detected);
      return;
    }

    // In dev mode the URL has no locale prefix — don't redirect
    if (!isLocaleUrl) return;

    // Already on the right locale, nothing to do
    if (currentLocale === stored) return;

    // Redirect to the stored locale (production only)
    window.location.replace('/' + stored);
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

  checkRequireLogin() {
    if (this.router.url === '/login' || this.router.url === '/') return

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

    this.idle.onIdleStart.subscribe({
      next: () => {
        this.idleState = "IDLE";
      }
    })

    // do something when the user is no longer idle
    this.idle.onIdleEnd.subscribe({
      next: () => {
        this.idleState = "NOT_IDLE"
        this.countdown = null;
        this.cd.detectChanges() // how do i avoid this kludge?
      }
    })

    // do something when the user has timed out
    this.idle.onTimeout.subscribe({
      next: () => {
        this.idleState = "TIMED_OUT"
        this.resetIdle();
        this.authenticationService.logout();

        if (GlobalConstants.requireLogin)
          this.router.navigate(['/login']);

        if (!GlobalConstants.requireLogin)
          this.router.navigate(['/home']);

        //  this.websocketService.closeConnection() --- IGNORE ---
      }
    })

    // do something as the timeout countdown does its thing
    this.idle.onTimeoutWarning.subscribe({
      next: (seconds: number | null | undefined) => {
        this.countdown = seconds
      }
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
    this.theme.init();
    this.loading = true
    this.checkRequireLogin()
    this.getSystemStatus();
    this.utils.isMobile()
    this.checkLanguage()
    this.importArabicStyles()

    this.radioSubscription = this.sharedService.radioObj.subscribe(radio => {
      this.radio = radio
    });

    this.routerObserver = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkIsMenuPage()
        this.checkIsLoginPage()
        this.updateBreadcrumb()

        if (!this.websocketService.messages) {
          this.websocketService.startService()
        }
      }
    });

    if (!this.websocketService.messages) {
      this.websocketService.startService()
    }
  }

  importArabicStyles() {
    const urlLocale = window.location.pathname.split('/')[1];
    const storedLanguage = localStorage.getItem('language');
    // URL is the authoritative source in production (locale-prefixed builds);
    // fall back to localStorage for dev mode where there is no locale prefix.
    const isArabic = urlLocale === 'ar' || storedLanguage === 'ar';
    document.body.classList.toggle('ar', isArabic);
  }

  ngOnDestroy() {
    this.routerObserver?.unsubscribe();
    this.radioSubscription?.unsubscribe();
  }
}