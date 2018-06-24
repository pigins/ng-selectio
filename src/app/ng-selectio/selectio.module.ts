import {ModuleWithProviders, NgModule} from '@angular/core';
import {SelectioPluginComponent} from './selectio.component';
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
import {SELECTIO_DEFAULTS_OVERRIDE, SelectioDefaultsOverride} from './model/defaults';

@NgModule({
  declarations: [
    SelectioPluginComponent,
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
  providers: [
    TextWidthService
  ],
  exports: [
    ReactiveFormsModule,
    SelectioPluginComponent,
    SearchComponent,
    SelectioRequiredValidator
  ]
})
export class NgSelectioModule {
  static forRoot(defaults: SelectioDefaultsOverride): ModuleWithProviders {
    return {
      ngModule: NgSelectioModule,
      providers: [{provide: SELECTIO_DEFAULTS_OVERRIDE, useValue: defaults}]
    };
  }
}
