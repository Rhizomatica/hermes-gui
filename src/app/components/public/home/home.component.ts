import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { ApiService } from 'src/app/_services/api.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { DarkModeService, DARK_MODE_OPTIONS } from 'angular-dark-mode';
import { User } from 'src/app/interfaces/user';


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
    private router: Router
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if (this.currentUser)
      this.admin = this.currentUser.admin
  }

  currentUser: User = null
  admin: boolean = false
  darkMode$: Observable<boolean> = this.darkModeService.darkMode$;
  currentTheme = 'light'

  ngOnInit(): void {
    this.currentTheme = JSON.parse(localStorage.getItem('dark-mode')).darkMode == true ? 'dark' : 'light'
  }

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
}
