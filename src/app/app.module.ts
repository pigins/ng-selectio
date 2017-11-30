import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {NgSelectioComponent} from './ng-selectio/ng-selectio/ng-selectio.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {ItemComponent} from './ng-selectio/ng-selectio/item.component';
import {SelectionComponent} from "./ng-selectio/ng-selectio/selection.component";
import {DropdownComponent} from "./ng-selectio/ng-selectio/dropdown.component";
import {TemplatePipe} from "./ng-selectio/ng-selectio/template.pipe";
import {SearchComponent} from "./ng-selectio/ng-selectio/search.component";

@NgModule({
  declarations: [
    AppComponent,
    NgSelectioComponent,
    ItemComponent,
    SelectionComponent,
    DropdownComponent,
    TemplatePipe,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
