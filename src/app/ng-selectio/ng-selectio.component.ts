import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef, EventEmitter, forwardRef, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/take';
import {Subscription} from 'rxjs/Subscription';
import {ListComponent} from './list.component';
import {Template} from './types';
import {Item} from './types';
import {SearchComponent} from './search.component';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {SelectionMode} from './types';

export enum KEY_CODE {
  UP_ARROW = 38,
  DOWN_ARROW = 40,
  ENTER = 13,
  BACKSPACE = 8
}

export const SELECTION_MODE_SINGLE = 'single';
export const SELECTION_MODE_MULTIPLE = 'multiple';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ng-selectio',
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgSelectioComponent), multi: true}
  ],
  template: `

    <div class="ngs" #ngs [attr.tabindex]="tabIndex" [ngClass]="{'expanded': expanded, 'open-up': openUp, 'autocomplete': autocomplete, 'disabled': disabled, 'focus': focus}"
         (focus)="onNgsFocus($event)"
         (blur)="onNgsBlur($event)"
         (keydown)="onKeyPress($event)"
    >
      <ng-container *ngFor="let order of verticalOrder; trackBy: trackByOpenUp">
        <div class="selection-wrapper" *ngIf="order===1">
          <selection #selectionComponent [ngStyle]="{'display': autocomplete ? 'inline-block' : 'block'}"
                     [items]="selection"
                     [highlightedItem]="highlightedItem"
                     [itemRenderer]="selectionItemRenderer"
                     [clearRenderer]="selectionClearRenderer"
                     [emptyRenderer]="autocomplete ? null : selectionEmptyRenderer"
                     [selectionMode]="selectionMode"
                     [showArrow]="!autocomplete"
                     [arrowDirection]="openUp ? !expanded : expanded"
                     [deletable]="allowClear"
                     [disabled]="disabled"
                     (click)="onClickSelection($event)"
                     (onDeleteItem)="onDeleteItem($event)"
                     (onHighlightItem)="onHighlightItem($event)"
          >
          </selection>
          <search #searchComponent *ngIf="autocomplete" style="display: inline-block"
                              [autocomplete]="autocomplete"
                              [searchPlaceholder]="searchPlaceholder"
                              [disabled]="disabled"
                              [searchDelay]="searchDelay"
                              [searchMinLength]="searchMinLength"
                              [tabIndex]="tabIndex"
                              (onSearchFocus)="onSearchFocus($event)"
                              (onSearchBlur)="onSearchBlur($event)"
                              (onSearchKeyDown)="onTextInputKeyDown($event)"
                              (onSearchValueChanges)="onSearchValueChanges($event)"
          ></search>
        </div>
        <div class="dropdown-wrapper" *ngIf="order===2" [ngStyle]="{'position': 'relative', 'display': expanded && !disabled ? 'block':'none'}" >
          <div class="dropdown" [ngStyle]="{'position':'absolute', 'z-index': 9999999, 'width': '100%', 'bottom': openUp ? 0: 'auto', 'top': !openUp ? 0: 'auto'}">
            <div>
              <ng-container *ngFor="let order of verticalOrder; trackBy: trackByOpenUp">
                <search #searchComponent *ngIf="order===1 && !autocomplete && search"
                        [autocomplete]="autocomplete"
                        [searchPlaceholder]="searchPlaceholder"
                        [disabled]="disabled"
                        [searchDelay]="searchDelay"
                        [searchMinLength]="searchMinLength"
                        [tabIndex]="tabIndex"
                        (onSearchFocus)="onSearchFocus($event)"
                        (onSearchBlur)="onSearchBlur($event)"
                        (onSearchKeyDown)="onTextInputKeyDown($event)"
                        (onSearchValueChanges)="onSearchValueChanges($event)"
                ></search>
                <list #listComponent *ngIf="order===2"
                      [data]="data"
                      [selection]="selection"
                      [expanded]="expanded"
                      [loadingMoreResults]="loadingMoreResults"
                      [searching]="searching"
                      [maxHeight]="dropdownMaxHeight"
                      [itemRenderer]="dropdownItemRenderer"
                      [disabledItemMapper]="dropdownDisabledItemMapper"
                      [emptyRenderer]="dropdownEmptyRenderer"
                      [paginationMessageRenderer]="dropdownPaginationMessageRenderer"
                      [paginationButtonRenderer]="dropdownPaginationButtonRenderer"
                      [searchingRenderer]="dropdownSearchingRenderer"
                      [keyEvents]="keyEvents"
                      [pagination]="pagination"
                      [disabled]="disabled"
                      [scrollToSelectionAfterOpen]="scrollToSelectionAfterOpen"
                      [trackByFn]="trackByFn"
                      (onSelectItem)="selectItem($event)"
                      (onNextPage)="onNextPageStart()"
                >
                </list>
              </ng-container>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `
})
export class NgSelectioComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {

  @Input() $data: Observable<Item[]> = Observable.of([]);
  @Input() $appendData: Observable<Item[]> = Observable.of([]);
  @Input() selectionMode: SelectionMode = SELECTION_MODE_SINGLE;
  @Input() selectionDefault: Item | Item[] | null = null;
  @Input() selectionDefaultMapper: (items: Item[]) => Item[] = (items: Item[]): Item[] => [];
  @Input() searchDelay: number = 0;
  @Input() searchMinLength: number = 0;
  @Input() search: boolean = false;
  @Input() paginationDelay: number = 0;
  @Input() pagination: boolean = false;
  @Input() autocomplete: boolean = false;
  @Input() disabled: boolean = false;
  @Input() closeAfterSelect: boolean = true;
  @Input() selectionMaxLength: number = -1;
  @Input() allowClear: boolean = false;
  @Input() dropdownDisabledItemMapper: (item: Item) => boolean = (item: Item) => false;
  @Input() tabIndex: number = 1;
  @Input() trackByFn: ((index: number, item: Item) => any) | null = null;
  @Input() openUp: boolean = false;
  @Input() scrollToSelectionAfterOpen: boolean = true;
  @Input() clearSearchAfterCollapse: boolean = true;

  static defaultItemRenderer = (item: Item) => {
    if (typeof item === 'string') {
      return item;
    } else if (typeof item === 'number') {
      return item + '';
    } else {
      return JSON.stringify(item);
    }
  };
  @Input() dropdownItemRenderer: Template<(item: Item, disabled: boolean) => string> = NgSelectioComponent.defaultItemRenderer;
  @Input() dropdownMaxHeight: string = '150px';
  @Input() searchPlaceholder: string = '';
  @Input() dropdownEmptyRenderer: Template<() => string> = 'Enter 1 or more characters';
  @Input() dropdownPaginationMessageRenderer: Template<() => string> = 'Loading more results...';
  @Input() dropdownPaginationButtonRenderer: Template<() => string> = 'Get more...';
  @Input() dropdownSearchingRenderer: Template<() => string> = 'Searching...';
  @Input() selectionItemRenderer: Template<(item: Item) => string> = NgSelectioComponent.defaultItemRenderer;
  @Input() selectionEmptyRenderer: Template<() => string> = 'No data';
  @Input() selectionClearRenderer: Template<() => string> = '&#10005';

  @Output() onSearch = new EventEmitter<string>();
  @Output() onNextPage = new EventEmitter<{ currentLength: number, search: string }>();
  @Output() onSelect = new EventEmitter<Item>();

  @ViewChild('ngs') ngs: ElementRef;
  @ViewChild('searchComponent') searchComponent: SearchComponent;
  @ViewChild('listComponent') listComponent: ListComponent;

  data: Item[] = [];
  selection: Item[] = [];
  highlightedItem: Item | null = null;
  expanded: boolean;
  focus: boolean = false;
  loadingMoreResults: boolean = false;
  searching: boolean = false;
  keyEvents = new EventEmitter<KeyboardEvent>();
  verticalOrder = [1, 2];
  private expandedChangedSubscription: Subscription;
  private expandedChanged = new EventEmitter<boolean>();
  private changed: Array<(value: Item[]) => void> = [];
  private touched: Array<() => void> = [];

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  // control value accessor
  touch() {
    this.touched.forEach(f => f());
  }

  modelChange() {
    this.changed.forEach(f => f(this.selection));
  }

  writeValue(obj: Item[]): void {
    if (obj === null) {
      this.selection = [];
      this.modelChange();
    } else {
      this.selection = obj;
      this.modelChange();
    }
  }

  registerOnChange(fn: (value: Item[]) => void): void {
    this.changed.push(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.touched.push(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.$data && changes.$data.currentValue) {
      this.$data.take(1).subscribe((data) => {
        this.data = data;
        if (this.autocomplete && changes.$data.previousValue && this.searchComponent.notEmpty()) {
          this.expanded = true;
        }
        this.searching = false;
        this.changeDetectorRef.markForCheck();
      });
    }
    if (changes.$appendData && changes.$appendData.currentValue) {
      this.$appendData.take(1).subscribe((data) => {
        this.data = this.data.concat(data);
        this.changeDetectorRef.markForCheck();
        this.loadingMoreResults = false;
      });
    }
    if (changes.openUp) {
      if (changes.openUp.currentValue) {
        this.verticalOrder = [2, 1];
      } else {
        this.verticalOrder = [1, 2];
      }
    }
  }

  ngOnInit(): void {
    this.expandedChangedSubscription = this.expandedChanged.subscribe((expanded: boolean) => {
      this.expanded = expanded;
      if (this.expanded && this.searchComponent) {
        this.searchComponent.focus();
      }
      if (this.search && this.clearSearchAfterCollapse && !this.expanded) {
        this.searchComponent.empty();
      }
    });
    if (this.selectionDefault) {
      if (Array.isArray(this.selectionDefault)) {
        this.selection = this.selectionDefault;
        this.modelChange();
      } else {
        this.selection = [this.selectionDefault];
        this.modelChange();
      }
    } else if (this.selectionDefaultMapper) {
      this.selection = this.selectionDefaultMapper(this.data);
      this.modelChange();
    }
    if (this.selection.length > 0) {
      this.selection.forEach((item: Item) => {
        this.onSelect.emit(item);
      });
    }
  }

  ngOnDestroy(): void {
    this.expandedChangedSubscription.unsubscribe();
  }

  onSearchValueChanges(value: string): void {
    this.onSearch.emit(value);
    this.searching = true;
  }

  onClickSelection(): void {
    if (!this.autocomplete) {
      this.expandedChanged.emit(!this.expanded);
    }
  }

  selectItem(item: Item): void {
    if (this.selectionMode === SELECTION_MODE_SINGLE) {
      this.selection = [item];
      this.modelChange();
    } else if (this.selectionMode === SELECTION_MODE_MULTIPLE) {
      if (this.selectionMaxLength < 0 || (this.selection.length + 1 <= this.selectionMaxLength)) {
        this.selection.push(item);
        this.modelChange();
      }
    }
    if (this.closeAfterSelect) {
      this.expandedChanged.emit(false);
    }
    this.onSelect.emit(item);
  }

  onNgsFocus($event: Event): void {
    this.focus = true;
    if (this.autocomplete) {
      this.searchComponent.focus();
    }
  }

  onSearchFocus($event: Event): void {
    this.focus = true;
  }

  onNgsBlur($event: Event) :void {
    const e = (<any>$event);
    if (this.searchComponent && e.relatedTarget === this.searchComponent.getNativeElement()) {
      /*NOPE*/
    } else if (this.expanded) {
      this.expandedChanged.emit(false);
    }
    this.focus = false;
  }

  onSearchBlur($event: Event): void {
    const e = (<any>$event);
    if (e.relatedTarget === this.ngs.nativeElement) {
      /*NOPE*/
    } else if (this.expanded) {
      this.expandedChanged.emit(false);
    }
    this.focus = false;
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.DOWN_ARROW && !this.expanded && this.hasFocus()) {
      this.expandedChanged.emit(true);
    }
    this.keyEvents.emit(event);
  }

  onNextPageStart() {
    this.loadingMoreResults = true;
    this.changeDetectorRef.detectChanges();
    this.listComponent.scrollToTheBottom();
    setTimeout(() => {
      this.onNextPage.emit({currentLength: this.data.length, search: this.searchComponent.getValue()});
    }, this.paginationDelay);
  }

  onDeleteItem(_item: Item) {
    this.selection = this.selection.filter(item => item !== _item);
    this.modelChange();
  }

  onHighlightItem(_item: Item) {
    this.highlightedItem = _item;
  }

  onTextInputKeyDown(event: KeyboardEvent) {
    if (this.autocomplete) {
      if (event.keyCode === KEY_CODE.BACKSPACE && !this.searchComponent.getValue()) {
        if (!this.highlightedItem) {
          this.highlightedItem = this.selection[this.selection.length - 1];
        } else {
          this.selection = this.selection.filter(item => item !== this.highlightedItem);
          this.modelChange();
          this.highlightedItem = null;
        }
      }
    }
  }

  trackByOpenUp(index, item) {
    return item;
  }

  private hasFocus(): boolean {
    if (document.activeElement) {
      return document.activeElement === this.ngs.nativeElement || document.activeElement === this.searchComponent.getNativeElement();
    } else {
      return false;
    }
  }

  // public methods
  public getSearchComponent(): SearchComponent {
    return this.searchComponent;
  }

  public getData(): Item[] {
    return this.data;
  }

}
