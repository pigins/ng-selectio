import {NgModule} from '@angular/core';
import {NgSelectioComponent} from './ng-selectio.component';
import {SelectionComponent} from './selection.component';
import {ListComponent} from './list.component';
import {SearchComponent} from './search.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {TextWidthService} from './text-width.service';
import {ClickOutsideDirective} from './click-outside.directive';
import {DefaultItemPipe} from './defaultItem.pipe';

@NgModule({
  declarations: [
    NgSelectioComponent,
    SelectionComponent,
    ListComponent,
    DefaultItemPipe,
    SearchComponent,
    ClickOutsideDirective
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [TextWidthService],
  exports: [
    ReactiveFormsModule,
    NgSelectioComponent,
    SearchComponent
  ]
})
export class NgSelectioModule {

}
