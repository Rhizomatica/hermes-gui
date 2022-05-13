import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../../_services/authentication.service';
import { User } from '../../interfaces/user';

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
  wrong = false;

  constructor(private router: Router, private authenticationService: AuthenticationService) {
  }

  hideForm() {
    this.hideLoginForm.emit();
  }

  submitLogin(f: NgForm): void {
    this.authenticationService.login(f.value.email, f.value.password).subscribe(
      (res: any) => {
        this.res = res;
        this.currentUser = res;
        this.wrong = false;
        this.hideForm();
        return res;
      },
      (err) => {
        this.error = err;
        this.wrong = true;
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
