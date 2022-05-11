import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../_services/authentication.service';
import { User } from '../../../interfaces/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})

export class LoginComponent implements OnInit {
  res = '';
  error = Error;
  currentUser: User;
  success = false;
  wrong = false;

  constructor(private router: Router,
    private authenticationService: AuthenticationService) {

    }

  submitLogin(f: any): void {
    console.log('⚚ login - submitLogin: f.value: ', f.value);
    this.authenticationService.login(f.value.email, f.value.password).subscribe(
      (res: any) => {
        this.res = res;
        this.wrong = false;
        this.router.navigate(['/admin']);
        return res;
      },
      (err) => {
        this.error = err;
        this.wrong = true;
        this.router.navigate(['/login']);
      }
    );
  }

  submitTest(f: any): void {
    console.log('⚚ login - submitTest: res: ', f.value);
  }

  submitLogout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
  }
}
