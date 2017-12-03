import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-select-input',
  template: `
    <div>
      <label style="display: inline-block">{{label}}</label>
      <select (change)="valueChange.emit($event.srcElement.value)" style="display: inline-block">
        <option *ngFor="let option of options" [attr.value]="option">
          {{option}}
        </option>
      </select>
    </div>
  `,
  styles: [`
    
  `]
})
export class SelectInputComponent implements OnInit {
  @Input() label: string;
  @Input() options: any[];
  @Output() valueChange = new EventEmitter<number>();
  constructor() { }
  ngOnInit() {
  }
}
