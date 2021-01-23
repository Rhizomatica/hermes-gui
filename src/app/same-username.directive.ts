import { Directive, Input } from '@angular/core';
import { AbstractControl, FormGroup, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';
import { User } from './user';
import { UserService } from './user.service';


export function compareUsername(userList: any): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let alreadyExist = false;
    for (let user of userList) {
      if (user === control.value) {
        alreadyExist = true;
      }
    }
    return alreadyExist ? { Email: { value: control.value } } : null;
  };
}

@Directive({
  selector: '[appSameUsername]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: SameUsernameDirective,
      multi: true
    }
  ]
})
export class SameUsernameDirective implements Validator {
  @Input() userList: any;

  validate(control: AbstractControl): { [key: string]: any } | null {
    console.log(this.userList);
    return this.userList ? compareUsername(this.userList)(control) : null;
  }
}