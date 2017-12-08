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
import {DropdownComponent} from './dropdown.component';
import {Template} from './template';
import {Item} from './item';
import {SearchComponent} from './search.component';
import {ValueAccessorBase} from '../builder-page/value-accessor-base';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

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
  selector: 'app-ng-selectio',
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgSelectioComponent), multi: true}
  ],
  template: `

    <div class="ngs" #ngs [attr.tabindex]="tabIndex" (blur)="onBlur($event)" (keydown)="onKeyPress($event)">
      <ng-container *ngFor="let order of verticalOrder; trackBy: trackByOpenOnTop">
        <div *ngIf="order===1">
          <selection #selectionComponent [ngStyle]="{'display': autocomplete ? 'inline-block' : 'block'}"
                     [items]="selection"
                     [highlightedItem]="highlightedItem"
                     [itemRenderer]="selectionItemRenderer"
                     [emptyRenderer]="autocomplete ? null : selectionEmptyRenderer"
                     [selectionMode]="selectionMode"
                     [showArrow]="!autocomplete"
                     [arrowDirection]="openOnTop ? !expanded : expanded"
                     [deletable]="selectionDeletable"
                     [disabled]="disabled"
                     (click)="onClickSelection($event)"
                     (onDeleteItem)="onDeleteItem($event)"
                     (onHighlightItem)="onHighlightItem($event)"
          >
          </selection>
          <ng-selectio-search #searchComponent *ngIf="autocomplete" style="display: inline-block"
                              [autocomplete]="autocomplete"
                              [placeholder]="placeholder"
                              [disabled]="disabled"
                              [searchDelay]="searchDelay"
                              [searchStartLength]="searchStartLength"
                              (onSearchBlur)="onBlur($event)"
                              (onSearchKeyDown)="onTextInputKeyDown($event)"
                              (onSearchValueChanges)="onSearchValueChanges($event)"
          ></ng-selectio-search>
        </div>
        <div *ngIf="order===2" [ngClass]="{'ngs-dropdown': true, 'ngs-expanded': expanded && !disabled}">
          <div class="dropdown-cont" [ngStyle]="{'bottom': openOnTop ? 0: 'auto', 'top': !openOnTop ? 0: 'auto'}">
            <ng-container *ngFor="let order of verticalOrder; trackBy: trackByOpenOnTop">
              <ng-selectio-search #searchComponent *ngIf="order===1 && !autocomplete && showSearch"
                                  [autocomplete]="autocomplete"
                                  [placeholder]="placeholder"
                                  [disabled]="disabled"
                                  [searchDelay]="searchDelay"
                                  [searchStartLength]="searchStartLength"
                                  (onSearchBlur)="onBlur($event)"
                                  (onSearchKeyDown)="onTextInputKeyDown($event)"
                                  (onSearchValueChanges)="onSearchValueChanges($event)"
              ></ng-selectio-search>
              <ng-selectio-list #listComponent *ngIf="order===2"
                                [data]="data"
                                [selection]="selection"
                                [expanded]="expanded"
                                [loadingMoreResults]="loadingMoreResults"
                                [searching]="searching"
                                [maxHeight]="dropdownMaxHeight"
                                [itemRenderer]="dropdownItemRenderer"
                                [disabledItemMapper]="dropdownDisabledItemMapper"
                                [emptyRenderer]="dropdownEmptyRenderer"
                                [pagingMessageRenderer]="dropdownPagingMessageRenderer"
                                [pagingButtonRenderer]="dropdownPagingButtonRenderer"
                                [searchingRenderer]="dropdownSearchingRenderer"
                                [keyEvents]="keyEvents"
                                [paging]="paging"
                                [disabled]="disabled"
                                [scrollToSelectionAfterOpen]="scrollToSelectionAfterOpen"
                                [trackByFn]="trackByFn"
                                (onSelectItem)="selectItem($event)"
                                (onNextPage)="onNextPageStart()"
              >
              </ng-selectio-list>
            </ng-container>
          </div>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .ngs {
      border: 1px solid grey;
    }

    .ngs-dropdown {
      display: none;
      position: relative;
    }

    .ngs-dropdown.ngs-expanded {
      display: block;
    }

    .dropdown-cont {
      position: absolute;
      z-index: 9999999;
      width: 100%;
      background-color: aliceblue;
    }
  `]
})
export class NgSelectioComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {

  @Input() $data: Observable<Item[]> = Observable.of([]);
  @Input() $appendData: Observable<Item[]> = Observable.of([]);
  @Input() selectionMode: string = SELECTION_MODE_SINGLE;
  @Input() defaultSelection: Item | Item[] | null = null;
  @Input() defaultSelectionRule: (items: Item[]) => Item[] = (items: Item[]): Item[] => [];
  @Input() searchDelay: number = 0;
  @Input() searchStartLength: number = 0;
  @Input() showSearch: boolean = false;
  @Input() pagingDelay: number = 0;
  @Input() paging: boolean = false;
  @Input() autocomplete: boolean = false;
  @Input() disabled: boolean = false;
  @Input() closeOnSelect: boolean = true;
  @Input() maxSelectionLength: number = -1;
  @Input() selectionDeletable: boolean = false;
  @Input() dropdownDisabledItemMapper: (item: Item) => boolean = (item: Item) => false;
  @Input() tabIndex: number = 1;
  @Input() trackByFn: ((index: number, item: Item) => any) | null = null;
  @Input() openOnTop: boolean = false;
  @Input() scrollToSelectionAfterOpen: boolean = true;

  // templates
  static defaultItemRenderer = (item: Item) => {
    if (typeof item === 'string') {
      return item;
    } else if (typeof item === 'number') {
      return item + '';
    } else {
      return JSON.stringify(item);
    }
  };
  @Input() dropdownItemRenderer: Template<(countryItem: Item, disabled: boolean) => string> = NgSelectioComponent.defaultItemRenderer;
  @Input() selectionItemRenderer: Template<(item: Item) => string> = NgSelectioComponent.defaultItemRenderer;
  @Input() dropdownMaxHeight: string = '100px';
  @Input() placeholder: string = '';
  @Input() dropdownEmptyRenderer: Template<() => string> = 'Enter 1 or more characters';
  @Input() dropdownPagingMessageRenderer: Template<() => string> = 'Loading more results...';
  @Input() dropdownPagingButtonRenderer: Template<() => string> = 'Get more...';
  @Input() dropdownSearchingRenderer: Template<() => string> = 'Searching...';
  @Input() selectionEmptyRenderer: Template<() => string> = 'No data';

  @Output() onSearch = new EventEmitter<string>();
  @Output() onNextPage = new EventEmitter<{ currentLength: number, search: string }>();
  @Output() onSelect = new EventEmitter<Item>();

  @ViewChild('ngs') ngs: ElementRef;
  @ViewChild('searchComponent') searchComponent: SearchComponent;
  @ViewChild('listComponent') listComponent: DropdownComponent;

  data: Item[] = [];
  selection: Item[] = [];
  highlightedItem: Item | null = null;
  expanded: boolean;
  loadingMoreResults: boolean = false;
  searching: boolean = false;
  keyEvents = new EventEmitter<KeyboardEvent>();
  verticalOrder = [1, 2];
  private expandedChangedSubscription: Subscription;
  private expandedChanged = new EventEmitter<boolean>();
  private changed = new Array<(value: Item[]) => void>();
  private touched = new Array<() => void>();

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
    if (changes.$data && this.$data) {
      this.$data.take(1).subscribe((data) => {
        this.data = data;
        if (this.autocomplete && changes.$data.previousValue && this.searchComponent.notEmpty()) {
          this.expanded = true;
        }
        this.searching = false;
        this.changeDetectorRef.markForCheck();
      });
    }
    if (changes.$appendData && this.$appendData) {
      this.$appendData.take(1).subscribe((data) => {
        this.data = this.data.concat(data);
        this.changeDetectorRef.markForCheck();
        this.loadingMoreResults = false;
      });
    }
    if (changes.openOnTop) {
      if (this.openOnTop) {
        this.verticalOrder = [2, 1];
      } else {
        this.verticalOrder = [1, 2];
      }
    }
  }

  ngOnInit(): void {
    if (!this.$data) {
      this.$data = Observable.of([]);
    }

    this.expandedChangedSubscription = this.expandedChanged.subscribe((expanded: boolean) => {
      this.expanded = expanded;
      if (this.expanded && this.searchComponent) {
        this.searchComponent.focus();
      }
    });

    if (this.defaultSelection) {
      if (Array.isArray(this.defaultSelection)) {
        this.selection = this.defaultSelection;
        this.modelChange();
      } else {
        this.selection = [this.defaultSelection];
        this.modelChange();
      }
    } else if (this.defaultSelectionRule) {
      this.selection = this.defaultSelectionRule(this.data);
      this.modelChange();
    }

    if (this.selection.length > 0) {
      this.selection.forEach((item: Item) => {
        this.onSelect.emit(item);
      });
    }

    this.onSelect.subscribe(() => {
    });
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
      if (this.maxSelectionLength < 0 || (this.selection.length + 1 <= this.maxSelectionLength)) {
        this.selection.push(item);
        this.modelChange();
      }
    }
    if (this.closeOnSelect) {
      this.expandedChanged.emit(false);
    }
    this.onSelect.emit(item);
  }

  onBlur($event: Event) {
    const e = (<any>$event);
    if (!this.expanded) {
      return;
    }
    if (!e.relatedTarget) {
      this.expandedChanged.emit(false);
      return;
    }
    if (this.searchComponent) {
      if (e.relatedTarget !== this.searchComponent.getNativeElement() && e.relatedTarget !== this.ngs.nativeElement) {
        this.expandedChanged.emit(false);
        return;
      }
    } else {
      if (e.relatedTarget !== this.ngs.nativeElement) {
        this.expandedChanged.emit(false);
        return;
      }
    }
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
    }, this.pagingDelay);
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

  trackByOpenOnTop(index, item) {
    return item;
  }

  private hasFocus(): boolean {
    if (document.activeElement) {
      return document.activeElement === this.ngs.nativeElement || document.activeElement === this.searchComponent.getNativeElement();
    } else {
      return false;
    }
  }
}
