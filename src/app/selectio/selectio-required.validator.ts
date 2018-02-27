import {NG_VALIDATORS, FormControl, Validator, AbstractControl} from '@angular/forms';
import {Directive} from '@angular/core';

/**
 * Use this function for reactive forms
 * @param {AbstractControl} c
 * @returns {any}
 */
export function selectioRequiredValidator(c: AbstractControl) {
  if (c.value && c.value.length !== 0) {
    return null;
  } else {
    return {required: true};
  }
}

/**
 * Use directive for template driven forms
 */
@Directive({
  selector: '[selectioRequired][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: SelectioRequiredValidator,
      multi: true
    }
  ]
})
export class SelectioRequiredValidator implements Validator {
  constructor() {}
  validate(c: FormControl) {
    return selectioRequiredValidator(c);
  }
}
