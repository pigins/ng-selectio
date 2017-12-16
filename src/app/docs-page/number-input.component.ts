import {Component, Input} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {ValueAccessorBase} from './value-accessor-base';

@Component({
  selector: 'app-number-input',
  template: `
    <div>
      <label style="display: inline-block">{{label}}</label>
      <input type="number" [(ngModel)]="value"/>
    </div>
  `,
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: NumberInputComponent, multi: true}
  ],
  styles: [`
    
  `]
})
export class NumberInputComponent extends ValueAccessorBase<number> {
  @Input() label: string;
  constructor() {
    super();
  }
}
