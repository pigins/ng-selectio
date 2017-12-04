import {Component, Input} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {ValueAccessorBase} from './value-accessor-base';

@Component({
  selector: 'app-text-input',
  template: `
    <div> 
      <label style="display: inline-block">{{label}}</label>
      <input [(ngModel)]="value" type="text"/>
    </div>
  `,
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: TextInputComponent, multi: true}
  ],
  styles: [`
    
  `]
})
export class TextInputComponent extends ValueAccessorBase<string> {
  @Input() label: string;
  constructor() {
    super();
  }
}
