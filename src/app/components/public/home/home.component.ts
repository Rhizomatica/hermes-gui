import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { ApiService } from 'src/app/_services/api.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { DarkModeService, DARK_MODE_OPTIONS } from 'angular-dark-mode';
import { User } from 'src/app/interfaces/user';
import { UtilsService } from 'src/app/_services/utils.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})

export class homeComponent implements OnInit {
  [x: string]: any;


  constructor(
    private authenticationService: AuthenticationService,
    private apiService: ApiService,
    private darkModeService: DarkModeService,
    private router: Router,
    private utils: UtilsService
  ) {
    this.checkBrowser(utils.detectBrowserName())
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if (this.currentUser)
      this.admin = this.currentUser.admin
  }

  currentUser: User = null
  admin: boolean = false
  darkMode$: Observable<boolean> = this.darkModeService.darkMode$;
  currentTheme = 'light'
  alertBrowserXP: Boolean = false
  frequency: Number = 0
  mode: String = ''

  logOff() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
    this.currentUser = null;
    this.admin = false
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

  getRadioStatus(): void {
    this.radioService.getRadioStatus().subscribe(
      (res: any) => {
        this.frequency = this.radio.freq === '' ? 0 : this.radio.freq
        this.mode = this.radio.mode
        this.loading = false
      },
      (err) => {
        this.error = err;
        this.loading = false;
      }
    );
  }

  ngOnInit(): void {
    this.currentTheme = JSON.parse(localStorage.getItem('dark-mode')).darkMode == true ? 'dark' : 'light'
  }
}
