import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../_services/authentication.service';
import { User } from '../user';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  res = '';
  error = Error;
  currentUser: User;

  //  constructor(private ApiService: ApiService) { }
  constructor(private  router: Router, private authenticationService: AuthenticationService) {
     // this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  submitLogin(f: any): void{
    console.log('⚚ login - submitLogin: f.value: ', f.value);
    this.authenticationService.login(f.value.email, f.value.password).subscribe(
      (res: any) => {
        this.res = res;
        console.log('⚚ login - submitLogin: res: ', res);
        return res;
      },
      (err) => {
        this.error = err;
        this.router.navigate(['/login']);
      }
    );
    this.router.navigate(['/admin']);
  }


  submitTest(f: any): void{
    console.log('⚚ login - submitTest: res: ', f.value);
  }

  submitLogout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
}

  ngOnInit(): void {
  }

}
