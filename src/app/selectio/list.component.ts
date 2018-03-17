import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Item} from './model/item';
import {Source} from './model/source';
import {SourceFactory} from './model/source-factory';
import {SourceItemDirective} from './source-item.directive';
import {Selection} from './model/selection';
import {SourceItem} from './model/source-item';
import {Subscription} from 'rxjs/Subscription';

export enum SourceType {
  TREE = 'tree', ARRAY = 'array'
}

@Component({
  selector: 'selectio-list',
  template: `
    <ng-container *ngTemplateOutlet="aboveUlTemplate;
    context:{source: _source, hasScroll: hasScroll()}"></ng-container>
    <ul #ul
        [ngStyle]="{'list-style-type': 'none', 'overflow-y':'auto', position: 'relative'}"
        (scroll)="onUlScroll($event)">
      <li #itemList
          *ngFor="let sourceItem of _source | selectionPipe:selection; trackBy: trackByFn"
          [sourceItem]="sourceItem"
          [ngClass]="{'active': !sourceItem.disabled && _source.isHighlited(sourceItem), 'selected': sourceItem.selected, 'disabled': sourceItem.disabled}"
          (mouseenter)="_source.setHighlited(sourceItem)"
          (click)="onClickItem(sourceItem)">
        <ng-container *ngTemplateOutlet="itemTemplate;context:{sourceItem: sourceItem}"></ng-container>
      </li>
    </ul>
    <ng-container *ngTemplateOutlet="underUlTemplate;
    context:{source: _source, hasScroll: hasScroll()}"></ng-container>
  `
})
export class ListComponent implements OnInit, OnChanges, OnDestroy {

  // inputs
  @Input() data: Item[];
  @Input() appendData: Item[];
  @Input() trackByFn: (index: number, sourceItem: SourceItem) => any;
  @Input() sourceType: SourceType;

  // external context
  @Input() selection: Selection;

  // templates
  @Input() itemTemplate: TemplateRef<any>;
  @Input() aboveUlTemplate: TemplateRef<any>;
  @Input() underUlTemplate: TemplateRef<any>;

  // outputs
  @Output() onNextPage = new EventEmitter<void>();
  @Output() onSelectItem = new EventEmitter<SourceItem[]>();
  @Output() onChangeData = new EventEmitter<Source>();
  @Output() afterSourceItemInit = new EventEmitter<SourceItem>();
  @Output() scrollExhausted = new EventEmitter<void>();

  @ViewChild('ul') ul: ElementRef;
  @ViewChildren('itemList', {read: SourceItemDirective}) itemList: QueryList<SourceItemDirective>;

  _source: Source = SourceFactory.getInstance(SourceType.ARRAY, []);

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && changes.data.currentValue) {
      this._source = SourceFactory.getInstance(this.sourceType, changes.data.currentValue, sourceItem => {
        this.afterSourceItemInit.emit(sourceItem);
      });
      this.onChangeData.emit(this._source);
    }
    if (changes.appendData && changes.appendData.currentValue) {
      this._source.appendDataItems(changes.appendData.currentValue);
      this.onChangeData.emit(this._source);
    }
    if (changes.selection && changes.selection.currentValue) {
      this._source.updateSelection(changes.selection.currentValue.toDataArray());
    }
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

  onUlScroll(event: Event) {
    if (this.checkScrollExhausted()) {
      this.scrollExhausted.emit();
    }
  }

  onClickItem(sourceItem: SourceItem) {
    if (sourceItem.disabled) {
      return;
    }
    this.onSelectItem.emit([sourceItem]);
  }

  emitNextPageEvent() {
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

  private checkScrollExhausted(): boolean {
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
