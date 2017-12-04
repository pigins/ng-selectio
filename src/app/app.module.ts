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
import { NumberInputComponent } from './builder-page/number-input.component';
import {SelectInputComponent} from './builder-page/select-input.component';
import {CheckboxInputComponent} from './builder-page/checkbox-input.component';
import {FormsModule} from '@angular/forms';
import {TextInputComponent} from './builder-page/text-input.component';


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ExamplesPageComponent,
    DocsPageComponent,
    BuilderPageComponent,
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
