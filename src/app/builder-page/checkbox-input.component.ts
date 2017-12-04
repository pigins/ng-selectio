import {Component, Input} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {ValueAccessorBase} from './value-accessor-base';

@Component({
  selector: 'app-checkbox-input',
  template: `
    <div>
      <label style="display: inline-block">{{label}}</label>
      <input type="checkbox" [(ngModel)]="value"/>
    </div>
  `,
  styles: [`

  `],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: CheckboxInputComponent, multi: true}
  ]
})
export class CheckboxInputComponent extends ValueAccessorBase<boolean> {
  @Input() label: string;

  constructor() {
    super();
  }
}
