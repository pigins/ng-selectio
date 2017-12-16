import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {HttpModule} from '@angular/http';
import {NgSelectioModule} from './ng-selectio/ng-selectio.module';
import {ExamplesPageComponent} from './examples-page/examples-page.component';
import {DocsPageComponent} from './docs-page/docs-page.component';
import {HomePageComponent} from './home-page/home-page.component';
import {routes} from './routes';
import {RouterModule} from '@angular/router';
import {DataService} from './service/data.service';
import { NumberInputComponent } from './docs-page/number-input.component';
import {SelectInputComponent} from './docs-page/select-input.component';
import {CheckboxInputComponent} from './docs-page/checkbox-input.component';
import {FormsModule} from '@angular/forms';
import {TextInputComponent} from './docs-page/text-input.component';


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ExamplesPageComponent,
    DocsPageComponent,
    NumberInputComponent,
    SelectInputComponent,
    TextInputComponent,
    CheckboxInputComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgSelectioModule,
    RouterModule.forRoot(routes, {useHash: true})
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
