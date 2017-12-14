import {NgModule} from '@angular/core';
import {NgSelectioComponent} from './ng-selectio.component';
import {SelectionComponent} from './selection.component';
import {ListComponent} from './list.component';
import {TemplatePipe} from './template.pipe';
import {SearchComponent} from './search.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    NgSelectioComponent,
    SelectionComponent,
    ListComponent,
    TemplatePipe,
    SearchComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    ReactiveFormsModule,
    NgSelectioComponent
  ]
})
export class NgSelectioModule {

}
