import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-number-input',
  template: `
    <div>
      <label style="display: inline-block">{{label}}</label>
      <input type="number" (change)="valueChange.emit(+$event.srcElement.value)"/>
    </div>
  `,
  styles: [`
    
  `]
})
export class NumberInputComponent implements OnInit {
  @Input() label: string;
  @Output() valueChange = new EventEmitter<number>();
  constructor() { }
  ngOnInit() {

  }
}
