import {TestBed} from '@angular/core/testing';
import {SelectioPluginComponent} from './selectio.component';
import {SelectioRequiredValidator} from './selectio-required.validator';
import {TextWidthService} from './text-width.service';
import {ListComponent} from './list.component';
import {SelectionPipe} from './selection.pipe';
import {SelectionComponent} from './selection.component';
import {DefaultItemPipe} from './default-item.pipe';
import {FilterPipe} from './filter.pipe';
import {ReactiveFormsModule} from '@angular/forms';
import {SearchComponent} from './search.component';
import {SourceItemDirective} from './source-item.directive';
import {ClickOutsideDirective} from './click-outside.directive';

describe('SelectionComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SelectioPluginComponent,
        SelectionComponent,
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
        ReactiveFormsModule
      ],
      providers: [TextWidthService]
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SelectioPluginComponent);
    const component = fixture.componentInstance;
    expect(component).toBeDefined();
  });

});
