import {NgModule} from '@angular/core';
import {SelectioPluginComponent} from './selectio-plugin.component';
import {SelectionComponent} from './selection.component';
import {ListComponent} from './list.component';
import {SearchComponent} from './search.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {TextWidthService} from './text-width.service';
import {ClickOutsideDirective} from './click-outside.directive';
import {DefaultItemPipe} from './defaultItem.pipe';
import {SelectioRequiredValidator} from './selectio-required.validator';
import {SourceItemDirective} from './source-item.directive';

@NgModule({
  declarations: [
    SelectioPluginComponent,
    SelectionComponent,
    ListComponent,
    DefaultItemPipe,
    SearchComponent,
    ClickOutsideDirective,
    SelectioRequiredValidator,
    SourceItemDirective
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
