import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../_services/authentication.service';
import { NgForm } from '@angular/forms';
import { GlobalConstants } from 'src/app/global-constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})

export class LoginComponent implements OnInit {
  res = '';
  error = Error;
  success = false;
  wrong = false;
  requireLogin: boolean = GlobalConstants.requireLogin
  login: boolean = false

  constructor(private router: Router,
    private authenticationService: AuthenticationService) { }


  loginOverall() {
    if (!this.login) {
      return this.login = true
    }

    if (this.login) {
      return this.login = false
    }
  }


  submitLogin(f: NgForm): void {
    this.authenticationService.login(f.value.email, f.value.password).subscribe(
      (res: any) => {
        this.res = res;
        this.wrong = false;
        this.router.navigate(['/home']);
        return res;
      },
      (err) => {
        this.error = err;
        this.wrong = true;
      }
    );
  }

  submitTest(f: NgForm): void {
    console.log('⚚ login - submitTest: res: ', f.value);
  }

  submitLogout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    return
  }
}
