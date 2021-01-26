import { Directive } from '@angular/core';
import { AbstractControl, FormGroup, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';


export const passMatch: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const pass = control.get('passw');
  const rePass = control.get('repassw');

  return pass && rePass && pass.value === rePass.value ? { passMatch: false } : null;
};

@Directive({
  selector: '[appRetype]',
  providers: [{ provide: NG_VALIDATORS, useExisting: RetypeDirective, multi: true }]

})

export class RetypeDirective implements Validator  {

  validate(control: AbstractControl): ValidationErrors {
    return passMatch(control);
  }
}


