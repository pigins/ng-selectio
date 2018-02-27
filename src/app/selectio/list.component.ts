import {
  Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, TemplateRef,
  ViewChild, ViewChildren
} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Item} from './types';
import {Subscription} from 'rxjs/Subscription';
import {Source, SourceItem} from './model/source';
import {SourceFactory} from './model/source';
import {SourceItemDirective} from './source-item.directive';
import {Selection} from './model/selection';

export enum SourceType {
  TREE = 'tree', ARRAY = 'array'
}

@Component({
  selector: 'selectio-list',
  template: `
    
    <ng-template #defaultItemTemplate let-sourceItem="sourceItem">
      <span>{{sourceItem | defaultItem}}</span>
    </ng-template>
    
    <ng-template #defaultLastLiTemplate let-source="source" let-pagination="pagination" let-appendingData="appendingData" let-searching="searching">
      <li *ngIf="(source.size() === 0)">Enter 1 or more characters</li>
      <li *ngIf="pagination && appendingData">Loading more data...</li>
      <li *ngIf="searching">Searching...</li>
    </ng-template>

    <ng-template #defaultAfterUlTemplate let-source="source" let-pagination="pagination" let-hasScroll="hasScroll">
      <span *ngIf="pagination && source.size > 0 && !hasScroll"
            (mousedown)="onPaginationClick($event)">
        Get more...
      </span>
    </ng-template>
    
    <ul #ul
        [ngStyle]="{'list-style-type': 'none', 'overflow-y':'auto', position: 'relative'}"
        (scroll)="onUlScroll($event)" >
      <li #itemList 
          *ngFor="let sourceItem of _source; trackBy: trackByFn"
          [sourceItem]="sourceItem"
          [ngClass]="{'active': !sourceItem.disabled && _source.isHighlited(sourceItem), 'selected': sourceItem.selected, 'disabled': sourceItem.disabled}"
          (mouseenter)="_source.setHighlited(sourceItem)"
          (click)="onClickItem(sourceItem)">
        <ng-container *ngTemplateOutlet="itemTemplate ? itemTemplate : defaultItemTemplate;
        context:{sourceItem: sourceItem}"></ng-container>
      </li>
      <ng-container *ngTemplateOutlet="lastLiTemplate ? lastLiTemplate : defaultLastLiTemplate;
      context:{source: _source, pagination: pagination, appendingData: appendingData, searching: searching}"></ng-container>
    </ul>
    <ng-container *ngTemplateOutlet="afterUlTemplate ? afterUlTemplate : defaultAfterUlTemplate;
    context:{source: _source, pagination: pagination, hasScroll: hasScroll()}"></ng-container>
  `
})
export class ListComponent implements OnInit, OnChanges, OnDestroy {

  // inputs
  @Input() $data: Observable<Item[]>;
  @Input() $appendData: Observable<Item[]>;
  @Input() pagination: boolean;
  @Input() trackByFn: (index: number, sourceItem: SourceItem) => any;
  @Input() disabledItemMapper: (item: Item) => boolean;
  @Input() sourceType: SourceType;

  // external context
  @Input() $selection: Observable<Selection>;
  @Input() searching: boolean;

  // templates
  @Input() itemTemplate: TemplateRef<any>;
  @Input() lastLiTemplate: TemplateRef<any>;
  @Input() afterUlTemplate: TemplateRef<any>;

  // outputs
  @Output() onNextPage = new EventEmitter<void>();
  @Output() onSelectItem = new EventEmitter<SourceItem[]>();
  @Output() onChangeData = new EventEmitter<Source>();

  @ViewChild('ul') ul: ElementRef;
  @ViewChildren('itemList', {read: SourceItemDirective}) itemList: QueryList<SourceItemDirective>;

  _source: Source = SourceFactory.getInstance(SourceType.ARRAY, []);
  updatingData: boolean;
  appendingData: boolean;

  dataSubscription: Subscription;
  appendDataSubscription: Subscription;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.$data && changes.$data.currentValue) {
      this.updatingData = true;
      this.dataSubscription = this.$data.take(1).subscribe((data: Item[]) => {
        this._source = SourceFactory.getInstance(this.sourceType, data, this.disabledItemMapper);
        this.onChangeData.emit(this._source);
        this.updatingData = false;
      });
    }
    if (changes.$appendData && changes.$appendData.currentValue) {
      this.appendingData = true;
      this.appendDataSubscription = this.$appendData.take(1).subscribe(data => {
        this._source.appendDataItems(data);
        this.onChangeData.emit(this._source);
        this.appendingData = false;
      });
    }
  }

  ngOnInit() {
    this.$selection.subscribe((selection: Selection) => {
      this._source.updateSelection(selection.toDataArray());
    });
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
    this.appendDataSubscription.unsubscribe();
  }

  onUlScroll(event: Event) {
    if (this.pagination && this.scrollExhausted() && !this.appendingData) {
      this.onNextPage.emit();
    }
  }

  onClickItem(sourceItem: SourceItem) {
    if (sourceItem.disabled) {
      return;
    }
    this.onSelectItem.emit([sourceItem]);
  }

  onPaginationClick($event: MouseEvent): void {
    $event.preventDefault();
    this.onNextPage.emit();
  }

  hasScroll(): boolean {
    const ul = this.ul.nativeElement;
    return ul.scrollHeight > ul.clientHeight;
  }

  public scrollToSelection(): void {
    const selectionList = this.itemList.filter((li: SourceItemDirective) => {
      return li.sourceItem.selected;
    });
    if (selectionList.length > 0) {
      const lastSelectedLi = selectionList[selectionList.length - 1];
      this.ul.nativeElement.scrollTop = lastSelectedLi.topPosition;
    }
  }

  public scrollToTheBottom(): void {
    this.ul.nativeElement.scrollTop = this.ul.nativeElement.scrollHeight;
  }

  public scrollExhausted(): boolean {
    const ul = this.ul.nativeElement;
    return Math.abs(Math.round(ul.offsetHeight + ul.scrollTop) - Math.round(ul.scrollHeight)) === 0;
  }

  public getHighlited(): SourceItemDirective | null {
    const activeList = this.itemList.filter((li: SourceItemDirective) => {
      return this._source.getHighlited() === li.sourceItem;
    });
    if (activeList.length > 0) {
      return activeList[0];
    } else {
      return null;
    }
  }

  public isHidden() {
    return (this.ul.nativeElement.offsetParent === null);
  }

  public get source(): Source {
    return this._source;
  }
}
