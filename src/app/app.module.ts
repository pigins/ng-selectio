import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {HttpModule} from '@angular/http';
import {NgSelectioModule} from './ng-selectio/ng-selectio.module';
import {ExamplesPageComponent} from './examples-page/examples-page.component';
import {DocsPageComponent} from './docs-page/docs-page.component';
import {BuilderPageComponent} from './builder-page/builder-page.component';
import {HomePageComponent} from './home-page/home-page.component';
import {routes} from './routes';
import {RouterModule} from '@angular/router';
import {DataService} from './service/data.service';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ExamplesPageComponent,
    DocsPageComponent,
    BuilderPageComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    NgSelectioModule,
    RouterModule.forRoot(routes, {useHash: true})
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
