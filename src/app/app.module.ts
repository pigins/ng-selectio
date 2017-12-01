import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {HttpModule} from '@angular/http';
import {NgSelectioModule} from './ng-selectio/ng-selectio.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    NgSelectioModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
