import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef, Inject, Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewChildren, ViewEncapsulation
} from '@angular/core';
import {Subscription} from 'rxjs';
import {Item} from './model/item';
import {SearchComponent} from './search.component';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Source} from './model/source';
import {KeyboardStrategy} from './model/keyboard-strategy';
import {Selection} from './model/selection';
import {ModelService} from './model/model.service';
import {SourceItem} from './model/source-item';
import {SelectionItem} from './model/selection-item';
import {SourceItemDirective} from './source-item.directive';
import {KEY_CODE} from './model/key-codes';
import {SourceType} from './model/source-types';
import {SelectionMode} from './model/selection-modes';
import {SELECTIO_DEFAULTS, SELECTIO_DEFAULTS_OVERRIDE, SelectioDefaultsOverride} from './model/defaults';
import {SourceFactory} from './model/source-factory';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'ng-selectio',
  styleUrls:['selectio.component.css'],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SelectioComponent), multi: true},
    ModelService
  ],
  template: `
    <ng-template #defaultListItemTemplate let-sourceItem="sourceItem">
      <span>{{sourceItem.item | defaultItem}}</span>
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
      <span>{{selectionItem.item | defaultItem}}</span>
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
      <ng-container *ngFor="let order of verticalOrder">
        <div class="selection-wrapper" *ngIf="order===1">
          <!-------------------SELECTION------------------------>
          <div (click)="onClickSelection()"
               [ngStyle]="{'position': 'relative', 'display': autocomplete ? 'inline-block' : 'block'}"
               [ngClass]="{'selection': true}">
            <div *ngIf="selection.size() === 0" class="empty">
              <ng-container
                *ngTemplateOutlet="autocomplete ? '' : selectionEmptyTemplate ? selectionEmptyTemplate : defaultSelectionEmptyTemplate"></ng-container>
            </div>
            <ng-container *ngIf="selection.size() >= 1">
              <div *ngIf="singleMode() && !allowClear" class="single">
                <div [ngClass]="{'single': true, 'selected': selection.firstItemHighlighted()}">
                  <ng-container
                    *ngTemplateOutlet="selectionItemTemplate ? selectionItemTemplate : defaultSelectionItemTemplate;context:{selectionItem:selection.get(0)}"></ng-container>
                </div>
              </div>
              <div *ngIf="singleMode() && allowClear" class="single allow-clear">
                <div [ngClass]="{'single': true, 'selected': selection.firstItemHighlighted()}">
                  <ng-container
                    *ngTemplateOutlet="selectionItemTemplate ? selectionItemTemplate : defaultSelectionItemTemplate;context:{selectionItem:selection.get(0)}"></ng-container>
                  <span class="clear" (click)="onDeleteClick($event, selection.get(0))">
                    <ng-container
                      *ngTemplateOutlet="selectionClearTemplate ? selectionClearTemplate : defaultSelectionClearTemplate"></ng-container>
                  </span>
                </div>
              </div>
              <div *ngIf="multipleMode() && !allowClear" class="multiple">
                <div *ngFor="let selectionItem of selection;"
                     [ngStyle]="{'display': 'inline-block'}"
                     [ngClass]="{'selected': selectionItem.highlighted}"
                     (click)="highlight(selectionItem)">
                  <ng-container
                    *ngTemplateOutlet="selectionItemTemplate ? selectionItemTemplate : defaultSelectionItemTemplate;context:{selectionItem:selectionItem}"></ng-container>
                </div>
              </div>
              <div *ngIf="multipleMode() && allowClear" class="multiple allow-clear">
                <div *ngFor="let selectionItem of selection"
                     [ngStyle]="{'display': 'inline-block'}"
                     [ngClass]="{'selected': selectionItem.highlighted}"
                     (click)="highlight(selectionItem)">
                  <span class="clear" (click)="onDeleteClick($event, selectionItem)">
                    <ng-container
                      *ngTemplateOutlet="selectionClearTemplate ? selectionClearTemplate : defaultSelectionClearTemplate"></ng-container>
                  </span>
                  <span>
                    <ng-container
                      *ngTemplateOutlet="selectionItemTemplate ? selectionItemTemplate : defaultSelectionItemTemplate;context:{selectionItem:selectionItem}"></ng-container>
                  </span>
                </div>
              </div>
            </ng-container>
            <span *ngIf="!autocomplete" [ngClass]="{'arrow': true, 'up-arrow': openUp ? !expanded : expanded}"></span>
          </div>
          <!-------------------AUTOCOMPLETE SEARCH------------------------>
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
        <!-------------------DROPDOWN------------------------>
        <div class="dropdown-wrapper" *ngIf="order===2"
             [ngStyle]="{'position': 'relative', 'display': expanded && !disabled ? 'block':'none'}">
          <div class="dropdown"
               [ngStyle]="{'position':'absolute', 'z-index': 9999999, 'width': '100%', 'bottom': openUp ? 0: 'auto', 'top': !openUp ? 0: 'auto'}">
            <div>
              <ng-container *ngFor="let order of verticalOrder">
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
                <div *ngIf="order===2">
                  <ng-container *ngTemplateOutlet="listAboveUlTemplate ? listAboveUlTemplate : defaultListAboveUlTemplate;
                  context:{source: source, hasScroll: hasScroll()}"></ng-container>
                  <ul #ul
                      [ngStyle]="{'list-style-type': 'none', 'overflow-y':'auto', position: 'relative'}"
                      (scroll)="onUlScroll($event)">
                    <li #itemList
                        *ngFor="let sourceItem of source | selectionPipe:selection; trackBy: trackByFn, let i = index"
                        [sourceItem]="sourceItem"
                        [ngClass]="{'active': !sourceItem.disabled && sourceItem.highlighted, 'selected': sourceItem.selected, 'disabled': sourceItem.disabled}"
                        (mouseenter)="source.highlight(i)"
                        (click)="onClickItem(sourceItem)">
                      <ng-container
                        *ngTemplateOutlet="listItemTemplate ? listItemTemplate : defaultListItemTemplate;context:{sourceItem: sourceItem}"></ng-container>
                    </li>
                  </ul>
                  <ng-container *ngTemplateOutlet="listUnderUlTemplate ? listUnderUlTemplate : defaultListUnderUlTemplate;
                  context:{source: source, hasScroll: hasScroll()}"></ng-container>
                </div>
              </ng-container>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `
})
export class SelectioComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {
  @Input() data: Item[];
  @Input() appendData: Item[];
  @Input() selectionMode: SelectionMode;
  @Input() searchDelay: number;
  @Input() searchMinLength: number;
  @Input() search: boolean;
  @Input() paginationDelay: number;
  @Input() pagination: boolean;
  @Input() autocomplete: boolean;
  @Input() disabled: boolean;
  @Input() closeAfterSelect: boolean;
  @Input() selectionMaxLength: number;
  @Input() allowClear: boolean;
  @Input() tabIndex: number;
  @Input() trackByFn: ((index: number, item: Item) => any) | null;
  @Input() openUp: boolean;
  @Input() scrollToSelectionAfterOpen: boolean;
  @Input() clearSearchAfterCollapse: boolean;
  @Input() searchPlaceholder: string;
  @Input() sourceType: SourceType; // no runtime change
  @Input() keyboardStrategy: KeyboardStrategy;
  @Input() equals: string | ((item1: Item, item2: Item) => boolean); // no runtime change

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
  @ViewChild('ul') ul: ElementRef;
  @ViewChildren('itemList', {read: SourceItemDirective}) itemList: QueryList<SourceItemDirective>;

  cross = '&#10005';
  expanded: boolean;
  focus = false;
  verticalOrder = [1, 2];
  selection: Selection;
  source: Source;
  private selectionSubscription: Subscription;
  private expandedChangedSubscription: Subscription;
  private sourceSubscription: Subscription;
  private expandedChanged = new EventEmitter<boolean>();
  private model: ModelService;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private injector: Injector,
    @Inject(SELECTIO_DEFAULTS_OVERRIDE) override: SelectioDefaultsOverride
  ) {
    Object.assign(this, SELECTIO_DEFAULTS, override);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.model) {
      if (changes.selectionMode) {this.model.setSelectionMode(changes.selectionMode.currentValue); }
      if (changes.selectionMaxLength) {this.model.setSelectionMaxLength(changes.selectionMaxLength.currentValue); }
      if (changes.data) {this.model.setSourceItems(changes.data.currentValue); }
      if (changes.appendData) {this.model.appendToSource(changes.appendData.currentValue); }
    }
    if (changes.openUp && changes.openUp.currentValue) {
      this.verticalOrder = [2, 1];
    } else if (changes.openUp && !changes.openUp.currentValue) {
      this.verticalOrder = [1, 2];
    }
  }

  ngOnInit(): void {
    this.model = this.injector.get(ModelService);
    let equalsFn;
    if (typeof this.equals === 'function') {
      equalsFn = <any>this.equals;
    } else {
      equalsFn = ((item1, item2) => item1[<string>this.equals] === item2[<string>this.equals]);
    }
    this.model.setSelection(new Selection(this.selectionMode, this.selectionMaxLength, equalsFn));
    this.model.setSource(SourceFactory.getInstance(this.sourceType, equalsFn, this.data.concat(this.appendData),
      (sourceItem) => {
        this.afterSourceItemInit.emit(sourceItem);
      }
    ));

    if (this.openUp) {
      this.verticalOrder = [2, 1];
    }

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
          this.scrollToSelection();
      }
    });
    this.selectionSubscription = this.model.$selectionsObservable.subscribe(selection => {
      this.selection = selection;
      if (this.changed) {
        this.changed(selection.getItems());
      }
    });
    this.sourceSubscription = this.model.$sourceObservable.subscribe(source => this.source = source);
    this.model.nextSource();
    this.model.nextSelection();
  }

  ngOnDestroy(): void {
    this.expandedChangedSubscription.unsubscribe();
    this.selectionSubscription.unsubscribe();
    this.sourceSubscription.unsubscribe();
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
      this.keyboardStrategy.onKeyPress(event, this, this.model);
    }
  }

  onNextPageStart() {
    this.changeDetectorRef.detectChanges();
    this.scrollToTheBottom();
    setTimeout(() => {
      this.onNextPage.emit({currentLength: this.source.size(), search: this._searchComponent.getValue()});
    }, this.paginationDelay);
  }

  onPaginationClick($event: MouseEvent): void {
    $event.preventDefault();
    this.onNextPageStart();
  }

  onTextInputKeyDown(event: KeyboardEvent) {
    if (this.autocomplete && event.keyCode === KEY_CODE.BACKSPACE && !this._searchComponent.getValue()) {
      this.selection.deleteLastItem();
    }
  }

  onDeleteClick(event: MouseEvent, selectionItem: SelectionItem) {
    if (this.disabled) {
      return;
    }
    event.stopPropagation();
    this.model.removeSelectionItem(selectionItem);
  }

  highlight(selectionItem: SelectionItem) {
    if (this.disabled) {
      return;
    }
    this.model.highlightSelectionItem(selectionItem);
  }

  singleMode() {
    return this.selectionMode === SelectionMode.SINGLE;
  }

  multipleMode() {
    return this.selectionMode === SelectionMode.MULTIPLE;
  }

  hasFocus(): boolean {
    if (document.activeElement) {
      return document.activeElement === this.ngs.nativeElement || document.activeElement === this._searchComponent.getNativeElement();
    } else {
      return false;
    }
  }

  expand() {
    this.expandedChanged.emit(true);
  }

  collapse() {
    this.expandedChanged.emit(false);
  }

  get searchComponent(): SearchComponent {
    return this._searchComponent;
  }

  hasScroll(): boolean {
    if (this.ul) {
      const ul = this.ul.nativeElement;
      return ul.scrollHeight > ul.clientHeight;
    } else {
      return false;
    }
  }
  onUlScroll(event: Event) {
    if (this.checkScrollExhausted()) {
      this.listScrollExhausted.emit();
    }
  }
  private checkScrollExhausted(): boolean {
    const ul = this.ul.nativeElement;
    return Math.abs(Math.round(ul.offsetHeight + ul.scrollTop) - Math.round(ul.scrollHeight)) === 0;
  }

  onClickItem(sourceItem: SourceItem) {
    if (sourceItem.disabled) {
      return;
    }
    this.model.selectItem(sourceItem);
    if (this.closeAfterSelect) {
      this.collapse();
    }
  }

  scrollToTheBottom(): void {
    this.ul.nativeElement.scrollTop = this.ul.nativeElement.scrollHeight;
  }

  scrollToSelection(): void {
    const selectionList = this.itemList.filter((li: SourceItemDirective) => {
      return li.sourceItem.selected;
    });
    if (selectionList.length > 0) {
      const lastSelectedLi = selectionList[selectionList.length - 1];
      this.ul.nativeElement.scrollTop = lastSelectedLi.topPosition;
    }
  }

  getHighlited(): SourceItemDirective | null {
    const activeList = this.itemList.filter((li: SourceItemDirective) => {
      return this.source.getHighlited() === li.sourceItem;
    });
    if (activeList.length > 0) {
      return activeList[0];
    } else {
      return null;
    }
  }

  getSource(): Source {
    return this.source;
  }
  // control value accessor
  private changed: (value: null | Item | Item[]) => void;
  private touched: () => void;

  touch() {
    if (this.touched) {
      this.touched();
    }
  }

  writeValue(items: Item[]): void {
    if (items === null || items === undefined) {
      this.model.clearSelection();
      return;
    }
    this.model.setSelectionItems(items);
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
