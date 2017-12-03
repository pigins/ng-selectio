import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-checkbox-input',
  template: `
    <div>
      <label style="display: inline-block">{{label}}</label>
      <input (change)="valueChange.emit($event.target.checked)" type="checkbox"/>
    </div>
  `,
  styles: [`
    
  `]
})
export class CheckboxInputComponent implements OnInit {
  @Input() label: string;
  @Output() valueChange = new EventEmitter<boolean>();
  constructor() { }
  ngOnInit() {
  }
}
