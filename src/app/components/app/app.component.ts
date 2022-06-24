import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, interval } from 'rxjs';
import { AuthenticationService } from '../../_services/authentication.service';
import { ApiService } from '../../_services/api.service';
import { User } from '../../interfaces/user';
import { DarkModeService, DARK_MODE_OPTIONS } from 'angular-dark-mode';
import { RadioService } from '../../_services/radio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})

export class AppComponent implements OnInit {
  currentUser: User;
  public iTimer = interval(30000);
  serverRes: any;
  error: any;
  system: any;
  fullStats = false;
  serverError = false;
  criticSpace = false;
  toggleButton = document.querySelector('.dark-button');
  darkMode$: Observable<boolean> = this.darkModeService.darkMode$;
  radio: any;
  protection = true;
  radioError = false;
  res: any;
  errorAlert = false;
  resetting = false;
  subscript: any;
  loading = true;

  title = 'hermes.radio';
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private apiService: ApiService,
    private radioService: RadioService,
    private darkModeService: DarkModeService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  getSystemStatus(): void {
    this.apiService.getStatus().subscribe(
      (res: any) => {
        this.system = res;
        if (this.system.diskfree < 10485760) {
          this.criticSpace = true;
        }
        return res;
      },
      (err) => {
        this.error = err;
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

  showFullStatus() {
    if (!this.fullStats) {
      this.fullStats = true;
    } else {
      this.fullStats = false;
    }
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
  
  onToggle(): void {
    this.darkModeService.toggle();
  }

  onActivate(event) {
    window.scrollTo(0, 0)
  }

  ngOnInit(): void {
    console.log('⚚ HERMES RADIO ⚚');
    this.getSystemStatus();
    this.getRadioStatus();
    this.subscript = this.iTimer.subscribe(() => this.getSystemStatus());
  }

}
