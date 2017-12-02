import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <a [routerLink]="''">Home</a>
      <a [routerLink]="'builder'">Builder</a>
      <a [routerLink]="'docs'">Documentation</a>
      <a [routerLink]="'examples'">Examples</a>
    </div>
    <router-outlet></router-outlet>
    <div>
      Footer
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {

}
