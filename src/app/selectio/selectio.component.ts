import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef, EventEmitter, forwardRef, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef,
  ViewChild
} from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/take';
import {Subscription} from 'rxjs/Subscription';
import {ListComponent, SourceType} from './list.component';
import {Item} from './model/item';
import {SearchComponent} from './search.component';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Source} from './model/source';
import {KeyboardStrategy} from './model/keyboard-strategy';
import {KeyboardStrategyDefault} from './model/keyboard-strategy-default';
import {SelectionComponent} from './selection.component';
import {Selection} from './model/selection';
import {ModelService} from './model.service';
import {SourceItem} from './model/source-item';

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
  selector: 'selectio-plugin',
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SelectioPluginComponent), multi: true},
    ModelService
  ],
  template: `
    <ng-template #defaultListItemTemplate let-sourceItem="sourceItem">
      <span>{{sourceItem.data | defaultItem}}</span>
    </ng-template>

    <ng-template #defaultListAboveUlTemplate>
    </ng-template>

    <ng-template #defaultListUnderUlTemplate let-hasScroll="hasScroll" let-source="source">
      <span *ngIf="(source.size() === 0)">Enter 1 or more characters</span>
      <span *ngIf="pagination && source.size > 0 && !hasScroll"
            (mousedown)="onPaginationClick($event)">
        Get more...
      </span>
    </ng-template>

    <ng-template #defaultSelectionItemTemplate let-selectionItem="selectionItem">
      <span>{{selectionItem.data | defaultItem}}</span>
    </ng-template>

    <ng-template #defaultSelectionEmptyTemplate>
      <span>No data</span>
    </ng-template>

    <ng-template #defaultSelectionClearTemplate>
      <span [innerHtml]="cross"></span>
    </ng-template>

    <div class="ngs" #ngs
         [attr.tabindex]="tabIndex"
         [ngClass]="{'expanded': expanded, 'open-up': openUp, 'autocomplete': autocomplete, 'disabled': disabled, 'focus': focus}"
         (focus)="onNgsFocus($event)"
         (keydown)="onKeyPress($event)"
         (keydown.tab)="onTab()"
         (clickOutside)="onClickOutside()"
    >
      <ng-container *ngFor="let order of verticalOrder; trackBy: trackByOpenUp">
        <div class="selection-wrapper" *ngIf="order===1">
          <selectio-selection #selectionComponent [ngStyle]="{'display': autocomplete ? 'inline-block' : 'block'}"
                              [selectionMode]="selectionMode"
                              [selectionMaxLength]="selectionMaxLength"
                              [showArrow]="!autocomplete"
                              [arrowDirection]="openUp ? !expanded : expanded"
                              [deletable]="allowClear"
                              [disabled]="disabled"
                              [itemTemplate]="selectionItemTemplate ? selectionItemTemplate : defaultSelectionItemTemplate"
                              [clearTemplate]="selectionClearTemplate ? selectionClearTemplate : defaultSelectionClearTemplate"
                              [emptyTemplate]="autocomplete ? '' : selectionEmptyTemplate ? selectionEmptyTemplate : defaultSelectionEmptyTemplate"
                              (click)="onClickSelection($event)"
                              (init)="onSelectionInit()"
          >
          </selectio-selection>
          <selectio-search #searchComponent *ngIf="autocomplete" style="display: inline-block"
                           [autocomplete]="autocomplete"
                           [searchPlaceholder]="searchPlaceholder"
                           [disabled]="disabled"
                           [searchDelay]="searchDelay"
                           [searchMinLength]="searchMinLength"
                           [tabIndex]="tabIndex"
                           (onSearchFocus)="onSearchFocus($event)"
                           (onSearchKeyDown)="onTextInputKeyDown($event)"
                           (onSearchValueChanges)="onSearchValueChanges($event)"
                           (onSearchMinLengthBorderCrossing)="onSearchBorderCrossing($event)"
          ></selectio-search>
        </div>
        <div class="dropdown-wrapper" *ngIf="order===2"
             [ngStyle]="{'position': 'relative', 'display': expanded && !disabled ? 'block':'none'}">
          <div class="dropdown"
               [ngStyle]="{'position':'absolute', 'z-index': 9999999, 'width': '100%', 'bottom': openUp ? 0: 'auto', 'top': !openUp ? 0: 'auto'}">
            <div>
              <ng-container *ngFor="let order of verticalOrder; trackBy: trackByOpenUp">
                <selectio-search #searchComponent *ngIf="order===1 && !autocomplete && search"
                                 [autocomplete]="autocomplete"
                                 [searchPlaceholder]="searchPlaceholder"
                                 [disabled]="disabled"
                                 [searchDelay]="searchDelay"
                                 [searchMinLength]="searchMinLength"
                                 [tabIndex]="tabIndex"
                                 (onSearchFocus)="onSearchFocus($event)"
                                 (onSearchKeyDown)="onTextInputKeyDown($event)"
                                 (onSearchValueChanges)="onSearchValueChanges($event)"
                ></selectio-search>
                <selectio-list #listComponent *ngIf="order===2"
                               [trackByFn]="trackByFn"
                               [itemTemplate]="listItemTemplate ? listItemTemplate : defaultListItemTemplate"
                               [aboveUlTemplate]="listAboveUlTemplate ? listAboveUlTemplate : defaultListAboveUlTemplate"
                               [underUlTemplate]="listUnderUlTemplate ? listUnderUlTemplate : defaultListUnderUlTemplate"
                               (afterSelectItems)="afterSelectItems($event)"
                               (onNextPage)="onNextPageStart()"
                               (scrollExhausted)="listScrollExhausted.emit()"
                               (onListInit)="onListInit()"
                >
                </selectio-list>
              </ng-container>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `
})
export class SelectioPluginComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {
  @Input() data: Item[] = [];
  @Input() appendData: Item[] = [];
  @Input() selectionMode: string = SELECTION_MODE_SINGLE;
  @Input() selectionDefault: Item | Item[] | null = null;
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
  @Input() tabIndex: number = 1;
  @Input() trackByFn: ((index: number, item: Item) => any) | null = null;
  @Input() openUp: boolean = false;
  @Input() scrollToSelectionAfterOpen: boolean = true;
  @Input() clearSearchAfterCollapse: boolean = true;
  @Input() searchPlaceholder: string = '';
  @Input() sourceType: SourceType = SourceType.ARRAY;
  @Input() keyboardStrategy: KeyboardStrategy = new KeyboardStrategyDefault();
  @Input() equals: string | ((item1: Item, item2: Item) => boolean) = ((item1, item2) => item1 === item2);

  // Templates
  @Input() listItemTemplate: TemplateRef<any>;
  @Input() listAboveUlTemplate: TemplateRef<any>;
  @Input() listUnderUlTemplate: TemplateRef<any>;
  @Input() selectionItemTemplate: TemplateRef<any>;
  @Input() selectionEmptyTemplate: TemplateRef<any>;
  @Input() selectionClearTemplate: TemplateRef<any>;

  @Output() onSearch = new EventEmitter<string>();
  @Output() onNextPage = new EventEmitter<{ currentLength: number, search: string }>();
  @Output() onSelect = new EventEmitter<Item>();
  @Output() afterSourceItemInit = new EventEmitter<SourceItem>();
  @Output() listScrollExhausted = new EventEmitter<void>();

  @ViewChild('ngs') ngs: ElementRef;
  @ViewChild('searchComponent') _searchComponent: SearchComponent;
  @ViewChild('listComponent') _listComponent: ListComponent;
  @ViewChild('selectionComponent') _selectionComponent: SelectionComponent;

  cross = '&#10005';
  expanded: boolean;
  focus: boolean = false;
  searching: boolean = false;
  verticalOrder = [1, 2];
  keyEvents = new EventEmitter<KeyboardEvent>();
  private expandedChangedSubscription: Subscription;
  private expandedChanged = new EventEmitter<boolean>();

  constructor(private changeDetectorRef: ChangeDetectorRef, private model: ModelService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.equals) {
      const value = changes.equals.currentValue;
      if (typeof changes.equals === 'function') {
        this.model.setEquals(value);
      } else {
        const fn = ((item1, item2) => item1[<string>value] === item2[<string>value]);
        this.model.setEquals(fn);
      }
    }
    if (changes.selectionMode) {
      this.model.setSelectionMode(changes.selectionMode.currentValue);
    }
    if (changes.selectionMaxLength) {
      this.model.setSelectionMaxLength(changes.selectionMaxLength.currentValue);
    }
    if (changes.openUp && changes.openUp.currentValue) {
      this.verticalOrder = [2, 1];
    } else {
      this.verticalOrder = [1, 2];
    }
    if (changes.data && changes.data.currentValue && changes.data.previousValue) {
      this.model.setSource(this.sourceType, changes.data.currentValue, sourceItem => {
        this.afterSourceItemInit.emit(sourceItem);
      });
    }
    if (changes.appendData && changes.appendData.currentValue && changes.appendData.previousValue) {
      this.model.appendToSource(changes.appendData.currentValue);
    }
  }

  ngOnInit(): void {
    this.model.$selectionsObservable.subscribe(selection => {
      if (this.changed) {
        this.changed(selection);
      }
    });

    this.expandedChangedSubscription = this.expandedChanged.subscribe((expanded: boolean) => {
      this.expanded = expanded;
      if (this.expanded && this._searchComponent) {
        this._searchComponent.focus();
      }
      if (this.search && this.clearSearchAfterCollapse && !this.expanded) {
        this._searchComponent.empty();
      }
      if (this.expanded && this.scrollToSelectionAfterOpen) {
          this.changeDetectorRef.detectChanges();
          this.listComponent.scrollToSelection();
      }
    });
  }

  onSelectionInit(): void {
    if (this.selectionDefault) {
      if (Array.isArray(this.selectionDefault)) {
        this.model.pushItemsToSelection(this.selectionDefault);
      } else {
        this.model.pushItemsToSelection([this.selectionDefault]);
      }
    }
  }

  onListInit(): void {
    this.model.setSource(this.sourceType, this.data, sourceItem => {
      this.afterSourceItemInit.emit(sourceItem);
    });
    if (this.appendData) {
      this.model.appendToSource(this.appendData);
    }
  }

  ngOnDestroy(): void {
    this.expandedChangedSubscription.unsubscribe();
  }

  onSearchValueChanges(value: string): void {
    this.onSearch.emit(value);
  }

  onSearchBorderCrossing(fromLeftToRight: boolean) {
    this.expandedChanged.emit(fromLeftToRight);
  }

  onClickSelection(): void {
    if (!this.autocomplete) {
      this.expandedChanged.emit(!this.expanded);
    }
  }

  afterSelectItems($event: SourceItem[]): void {
    if (this.closeAfterSelect) {
      this.collapse();
    }
  }

  onNgsFocus($event: Event): void {
    this.focus = true;
    if (this.autocomplete) {
      this._searchComponent.focus();
    }
  }

  onSearchFocus($event: Event): void {
    this.focus = true;
  }

  onTab() {
    if (this.expanded) {
      this.collapse();
    }
    this.focus = false;
    this.touch();
  }

  onClickOutside() {
    if (this.expanded) {
      this.collapse();
    }
    this.focus = false;
    this.touch();
  }

  onKeyPress(event: KeyboardEvent) {
    if (this.keyboardStrategy) {
      this.keyboardStrategy.onKeyPress(event, this);
    }
  }

  onNextPageStart() {
    this.changeDetectorRef.detectChanges();
    this._listComponent.scrollToTheBottom();
    setTimeout(() => {
      this.onNextPage.emit({currentLength: this.listComponent.source.size(), search: this._searchComponent.getValue()});
    }, this.paginationDelay);
  }

  onPaginationClick($event: MouseEvent): void {
    $event.preventDefault();
    this._listComponent.emitNextPageEvent();
  }

  onTextInputKeyDown(event: KeyboardEvent) {
    if (this.autocomplete && event.keyCode === KEY_CODE.BACKSPACE && !this._searchComponent.getValue()) {
      this._selectionComponent.selection.highlightOrDeleteLastItem();
    }
  }

  trackByOpenUp(index, item) {
    return item;
  }

  public hasFocus(): boolean {
    if (document.activeElement) {
      return document.activeElement === this.ngs.nativeElement || document.activeElement === this._searchComponent.getNativeElement();
    } else {
      return false;
    }
  }

  public expand() {
    this.expandedChanged.emit(true);
  }

  public collapse() {
    this.expandedChanged.emit(false);
  }

  // getters
  get listComponent(): ListComponent {
    return this._listComponent;
  }

  get searchComponent(): SearchComponent {
    return this._searchComponent;
  }

  get selectionComponent(): SelectionComponent {
    return this._selectionComponent;
  }

  get source(): Source {
    return this.listComponent.source;
  }


  // control value accessor
  private changed: (value: null | Item | Item[]) => void;
  private touched: () => void;

  touch() {
    if (this.touched) {
      this.touched();
    }
  }

  writeValue(selection: Selection): void {
    this.model.setSelection(selection);
  }

  registerOnChange(fn: (value: Item[]) => void): void {
    this.changed = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.touched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
