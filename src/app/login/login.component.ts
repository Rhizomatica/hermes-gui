import { Component, OnInit } from '@angular/core';

import { RouterModule } from '@angular/router';
import { NgForm } from '@angular/forms';

import { Api } from '../api';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  res = '';
  error = '';

  constructor(private ApiService: ApiService) { }

  //TODO must be ngForm!!!
  submitLogin(f: any): void{
    this.ApiService.getLogin(f.value.login, f.value.password).subscribe(
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

  ngOnInit(): void {
  }

}
