import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  template: `
    <div class="header">
      <div class="container">
        <p class="header-title">
          NgSelectio
        </p>
        <p class="header-description">
          A functional and nice Select control for <a class="primary-link" href="https://angular.io/">Angular</a>
        </p>
        <p class="menu-item"><a [routerLink]="link">{{linkName}}</a></p>
      </div>
    </div>
    <div class="block1">
      <div class="container">
        <a class="small-link" href="https://github.com/pigins/ng-selectio">See on GitHub</a>
        <div class="iframe-wrapper">
          <iframe src="https://ghbtns.com/github-btn.html?user=pigins&repo=ng-selectio&type=star&count=true&size=large" frameborder="0" scrolling="0" width="121px" height="30px"></iframe>
        </div>
      </div>
    </div>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  link: string;
  linkName: string;
  routerSubscription: Subscription;

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.routerSubscription = this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          if (event.url === '/docs') {
            this.link = '/';
            this.linkName = 'Examples';
          } else if (event.url === '/') {
            this.link = '/docs';
            this.linkName = 'Documentation';
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }
}
