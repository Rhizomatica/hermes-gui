import { Directive, Input } from '@angular/core';
import { AbstractControl, FormGroup, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';
import { User } from './user';
import { UserService } from './_services/user.service';



export function compareUsername(userList: any): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let alreadyExist = false;
    for (let user of userList) {
      if (user === control.value) {
        alreadyExist = true;
      }
    }
    return alreadyExist ? { Username: { value: control.value } } : null;
  };
}

//stackoverflow.com/questions/51114853/angular-6-template-driven-form-check-if-email-already-exist

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
  //@Input() userList: any;
  
  userList: User[];

  constructor(private userService: UserService) {}

  getUsers(): void {
    this.userService.getUsers().subscribe(
      (res: any) => {
        this.userList = res;
        console.log("pegou");
      },
      (err) => {
        this.userList = err;
        console.log("npegou");
      }
    );
  }

  validate(control: AbstractControl): { [key: string]: any } | null {
    console.log(this.userList);
    console.log("npeparigou");
    return this.userList ? compareUsername(this.userList)(control) : null;
  }
}