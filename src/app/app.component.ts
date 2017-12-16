import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="main-menu">
      <div class="container">
        <ul class="link-list">
          <li>
            <a [routerLink]="''">Home</a>
          </li>
          <li>
            <a [routerLink]="'docs'">Documentation</a>
          </li>
          <li>
            <a [routerLink]="'examples'">Examples</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="header">
      <div class="container">
        <p class="header-title">
          NgSelectio
        </p>
        <p class="header-description">
          A functional and nice Select control for <a class="primary-link" href="https://angular.io/">Angular</a>
        </p>
        <a class="small-link" href="https://github.com/pigins/ng-selectio">See on GitHub</a>
        <div class="iframe-wrapper">
          <iframe src="https://ghbtns.com/github-btn.html?user=pigins&repo=ng-selectio&type=star&count=true&size=large" frameborder="0" scrolling="0" width="121px" height="30px"></iframe>
        </div>
      </div>
    </div>
    <router-outlet></router-outlet>
    <div>
      
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {

}
