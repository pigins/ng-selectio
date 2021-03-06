import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SelectioComponent} from './selectio.component';
import {SelectioRequiredValidator} from './selectio-required.validator';
import {TextWidthService} from './text-width.service';
import {SelectionPipe} from './selection.pipe';
import {DefaultItemPipe} from './default-item.pipe';
import {FilterPipe} from './filter.pipe';
import {ReactiveFormsModule} from '@angular/forms';
import {SearchComponent} from './search.component';
import {SourceItemDirective} from './source-item.directive';
import {ClickOutsideDirective} from './click-outside.directive';
import {Selection} from './model/selection';
import {ModelService} from './model/model.service';
import {ChangeDetectionStrategy} from '@angular/core';

describe('SelectionComponent', () => {
  let component: SelectioComponent;
  let fixture: ComponentFixture<SelectioComponent>;
  let modelService: ModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SelectioComponent,
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
    }).overrideComponent(SelectioComponent, {
      set: {
        styleUrls: ['selectio.component.css'],
        changeDetection: ChangeDetectionStrategy.Default
      }
    });
    fixture = TestBed.createComponent(SelectioComponent);
    component = fixture.componentInstance;
    modelService = fixture.debugElement.injector.get(ModelService);
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('if ngModel contains value before creation, this value should be inside plugin', () => {
    const selectItem = 'test';
    component.data = [selectItem];
    fixture.detectChanges();
    const selectioElement: HTMLElement = fixture.nativeElement;
    component.writeValue(['test']);
    fixture.detectChanges();
    const listItem = selectioElement.querySelector('.selection .single span');
    expect(listItem.textContent).toEqual(selectItem);
  });
});
