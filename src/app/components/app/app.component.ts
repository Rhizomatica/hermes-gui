import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DecimalPipe, Location } from '@angular/common';
import { Observable, interval } from 'rxjs';
import { AuthenticationService } from '../../_services/authentication.service';
import { ApiService } from '../../_services/api.service';
import { User } from '../../interfaces/user';
import { RadioService } from '../../_services/radio.service';
import { UtilsService } from '../../_services/utils.service';
import { WebsocketService } from 'src/app/_services/websocket.service';
import { GlobalConstants } from 'src/app/global-constants';

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
  title = 'hermes.radio';
  mobile: any
  isMenuPage: boolean
  currentPage = 'home'
  currentUrl = '/home'
  frequency: Number = 0
  frequencyMode: String = null

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private apiService: ApiService,
    private radioService: RadioService,
    private utils: UtilsService,
    private location: Location,
    private websocketService: WebsocketService,
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
    if (utils.isItRuningLocal() && utils.isSBitxRadio()) {

      websocketService.messages.subscribe(msg => {
        if (msg) { //TODO - TEST PTT
          this.router.navigate(['/voice']);
          console.log(msg)
          // https://github.com/afarhan/sbitx/blob/main/web/index.html
          // TODO
          //Update frequency mode
          //Change mode
          //Change frequency
          //Listen ptt
        }
      });
    }
  }

  getSystemStatus(): void {
    this.apiService.getStatus().subscribe(
      (res: any) => {
        this.system = res;
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
        this.frequency = this.radio.freq == '' || this.radio.freq == null ? 0 : this.radio.freq  / 1000
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

  changeLanguageModal() {
    this.changeLanguage = this.changeLanguage ? false : true
  }

  checkLanguage() {
    this.changeLanguage = !localStorage.getItem('language') ? true : false
  }

  setLanguage(language) {
    localStorage.setItem('language', language)
    window.open('/' + language, '_self')
  }

  closeMobileMenu() {
    this.location.back();
  }

  chackIsMenuPage() {
    this.isMenuPage = this.router.url == '/menu' ? true : false
  }

  //TODO - Should be at component breadcrumb?
  updateBreadcrumb() {
    this.currentPage = this.router.url.split("/")[1]
    this.currentUrl = this.router.url
  }

  ngOnInit(): void {
    this.loading = true
    console.log('⚚ HERMES RADIO ⚚');
    this.getSystemStatus();
    this.getRadioStatus();
    this.mobile = this.utils.isMobile()
    this.checkLanguage()
  }
}
