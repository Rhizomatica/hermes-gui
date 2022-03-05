
import { Directive, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

import { User } from '../interfaces/user';
import { UserService } from '../_services/user.service';

export function compareUsername(userList: any): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let alreadyExist = true;
    for (const user of userList) {
      if (user.email === control.value) {
        alreadyExist = false;
      }
    }
    return alreadyExist ? { Username: { value: control.value } } : null;
  };
}

// Refe: stackoverflow.com/questions/51114853/angular-6-template-driven-form-check-if-email-already-exist

@Directive({
  selector: '[appUserExist]',
  exportAs: 'userExist',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: UserExistDirective,
      multi: true
    }
  ]
})

export class UserExistDirective implements Validator, OnInit {
  @Input('appUserExist') userFound: string;
  userList: User[];


  constructor(private userService: UserService) {}

  getUsers(): void {
    this.userService.getUsers().subscribe(
      (res: any) => {
        this.userList = res;
      },
      (err) => {
        this.userList = err;
      }
    );
  }

  validate(control: AbstractControl): { [key: string]: any } | null {
    return this.userList ? compareUsername(this.userList)(control) : null;
  }

  // TODO double check!
  // ERROR: 54:3   use-lifecycle-interface
  //  Lifecycle interface OnInit should be implemented for method ngOnInit. (https://angular.io/styleguide#style-09-01)

  ngOnInit(): void {
    this.getUsers();
  }
}
