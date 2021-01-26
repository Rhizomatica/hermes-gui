import { Component, OnInit } from '@angular/core';

import { RouterModule } from '@angular/router';
import { NgForm } from '@angular/forms';

import { Api } from '../api';
//import { ApiService } from '../api.service';
import { AuthenticationService } from '../authentication.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  res = '';
  error = '';

  //  constructor(private ApiService: ApiService) { }
  constructor(private AuthenticationService: AuthenticationService) { }

  //TODO must be ngForm!!!
  submitLogin(f: any): void{
    this.AuthenticationService.login(f.value.login, f.value.password).subscribe(
      (res: any) => {
        this.res = res;
        console.log(res);
        return res;
      },
      (err) => {
        this.error = err;
      }
    );
  }


  submitTeste(f: any): void{
    console.log(f.value);
  }


  ngOnInit(): void {
  }

}
