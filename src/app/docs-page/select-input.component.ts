import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {ValueAccessorBase} from './value-accessor-base';

interface Element {
  label: string;
  value: any;
}

@Component({
  selector: 'app-select-input',
  template: `
    <div>
      <label style="display: inline-block">{{label}}</label>
      <select [(ngModel)]="value" style="display: inline-block">
        <option *ngFor="let element of elements" [ngValue]="element.value">
          {{element.label}}
        </option>
      </select>
    </div>
  `,
  styles: [`
    
  `],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: SelectInputComponent, multi: true}
  ],
})
export class SelectInputComponent extends ValueAccessorBase<any> implements OnChanges {

  @Input() label: string;
  @Input() options: any[];
  elements: Element[];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.options && this.options) {
      if (this.options.length > 0) {
        if (typeof this.options[0] === 'string' || typeof this.options[0] === 'number') {
          this.elements = this.options.map((option) => {
            return {label: option, value: option};
          });
        } else if (typeof this.options[0] === 'object') {
          this.elements = this.options;
        }
      } else {
        this.elements = [];
      }
    }
  }
  constructor() {
    super();
  }
}
