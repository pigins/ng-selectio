import {NgModule} from '@angular/core';
import {SelectioPluginComponent} from './selectio.component';
import {ListComponent} from './list.component';
import {SearchComponent} from './search.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {TextWidthService} from './text-width.service';
import {ClickOutsideDirective} from './click-outside.directive';
import {DefaultItemPipe} from './default-item.pipe';
import {SelectioRequiredValidator} from './selectio-required.validator';
import {SourceItemDirective} from './source-item.directive';
import {SelectionPipe} from './selection.pipe';
import {FilterPipe} from './filter.pipe';

@NgModule({
  declarations: [
    SelectioPluginComponent,
    ListComponent,
    DefaultItemPipe,
    SearchComponent,
    ClickOutsideDirective,
    SelectioRequiredValidator,
    SourceItemDirective,
    SelectionPipe,
    FilterPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [TextWidthService],
  exports: [
    ReactiveFormsModule,
    SelectioPluginComponent,
    SearchComponent,
    SelectioRequiredValidator
  ]
})
export class SelectioPluginModule {

}
