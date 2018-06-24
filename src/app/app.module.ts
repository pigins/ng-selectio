import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {HttpModule} from '@angular/http';
import {SelectioModule} from 'selectio';
import {ExamplesPageComponent} from './examples-page/examples-page.component';
import {DocsPageComponent} from './docs-page/docs-page.component';
import {routes} from './routes';
import {RouterModule} from '@angular/router';
import {DataService} from './service/data.service';
import { NumberInputComponent } from './docs-page/number-input.component';
import {SelectInputComponent} from './docs-page/select-input.component';
import {CheckboxInputComponent} from './docs-page/checkbox-input.component';
import {FormsModule} from '@angular/forms';
import {TextInputComponent} from './docs-page/text-input.component';
import {SafeHtmlPipe} from './safeHtml.pipe';


@NgModule({
  declarations: [
    AppComponent,
    ExamplesPageComponent,
    DocsPageComponent,
    NumberInputComponent,
    SelectInputComponent,
    TextInputComponent,
    SafeHtmlPipe,
    CheckboxInputComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    SelectioModule.forRoot({}),
    RouterModule.forRoot(routes, {useHash: true})
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
