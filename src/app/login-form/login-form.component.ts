import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../_services/authentication.service';
import { User } from '../user';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.less']
})

export class LoginFormComponent implements OnInit {

  @Output() hideLoginForm = new EventEmitter();

  res = '';
  error = Error;
  currentUser: User;
  success = false;

  constructor(private  router: Router, private authenticationService: AuthenticationService) {
     // this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }


  hideForm() {
    this.hideLoginForm.emit();
  }

  submitLogin(f: NgForm): void{
    console.log('⚚ login - submitLogin: f.value: ', f.value);
    this.authenticationService.login(f.value.email, f.value.password).subscribe(
      (res: any) => {
        this.res = res;
        //console.log('⚚ login - submitLogin: res: ', res);
        this.hideForm();
        return res;
        
      },
      (err) => {
        this.error = err;
        let val = true;
      }
    );
    // this.router.navigate(['/admin']);
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
