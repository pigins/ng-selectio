import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgSelectioComponent } from './ng-selectio/ng-selectio/ng-selectio.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import { ItemComponent } from './ng-selectio/ng-selectio/item.component';
import {SafeHtmlPipe} from "./ng-selectio/ng-selectio/safe-html.pipe";
import {SelectionComponent} from "./ng-selectio/ng-selectio/selection.component";

@NgModule({
  declarations: [
    AppComponent,
    NgSelectioComponent,
    ItemComponent,
    SelectionComponent,
    SafeHtmlPipe
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
