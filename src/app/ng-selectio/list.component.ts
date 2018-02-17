import {
  Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, TemplateRef,
  ViewChild, ViewChildren
} from '@angular/core';
import {KEY_CODE} from './ng-selectio.component';
import {Observable} from 'rxjs/Observable';
import {Item} from './types';
import {Subscription} from 'rxjs/Subscription';
import {Source, SourceItem} from './model/source';
import {SourceFactory} from './model/source';

export enum SourceType {
  TREE = 'tree', ARRAY = 'array'
}

@Component({
  selector: 'list',
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
        [ngStyle]="{'max-height': maxHeight, 'list-style-type': 'none', 'overflow-y':'auto', position: 'relative'}"
        (scroll)="onUlScroll($event)" >
      <li #itemList
          *ngFor="let sourceItem of source; trackBy: trackByFn"
          [ngClass]="{'active': !sourceItem.disabled && source.isHighlited(sourceItem), 'selected': sourceItem.selected, 'disabled': sourceItem.disabled}"
          (mouseenter)="source.setHighlited(sourceItem)"
          (click)="onClickItem(sourceItem)">
        <ng-container *ngTemplateOutlet="itemTemplate ? itemTemplate : defaultItemTemplate;
        context:{sourceItem: sourceItem}"></ng-container>
      </li>
      <ng-container *ngTemplateOutlet="lastLiTemplate ? lastLiTemplate : defaultLastLiTemplate;
      context:{source: source, pagination: pagination, appendingData: appendingData, searching: searching}"></ng-container>
    </ul>
    <ng-container *ngTemplateOutlet="afterUlTemplate ? afterUlTemplate : defaultAfterUlTemplate;
    context:{source: source, pagination: pagination, hasScroll: hasScroll()}"></ng-container>
  `
})
export class ListComponent implements OnInit, OnChanges, OnDestroy {

  // inputs
  @Input() $data: Observable<Item[]>;
  @Input() $appendData: Observable<Item[]>;
  @Input() pagination: boolean;
  @Input() trackByFn: (index: number, sourceItem: SourceItem) => any;
  @Input() maxHeight: string;
  @Input() disabledItemMapper: (item: Item) => boolean;
  @Input() sourceType: SourceType;

  // external context
  @Input() selection: Item[];
  @Input() searching: boolean;
  @Input() keyEvents: Observable<KeyboardEvent>;

  // templates
  @Input() itemTemplate: TemplateRef<any>;
  @Input() lastLiTemplate: TemplateRef<any>;
  @Input() afterUlTemplate: TemplateRef<any>;

  @Output() onNextPage = new EventEmitter<void>();
  @Output() onSelectItem = new EventEmitter<SourceItem>();
  @Output() onChangeData = new EventEmitter<Item[]>();


  @ViewChild('ul') ul: ElementRef;
  @ViewChildren('itemList') itemList: QueryList<ElementRef>;

  source: Source = SourceFactory.getInstance(SourceType.ARRAY, []);
  keyEventsSubscription: Subscription;
  dataSubscription: Subscription;
  appendDataSubscription: Subscription;
  updatingData: boolean;
  appendingData: boolean;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.$data && changes.$data.currentValue) {
      this.updatingData = true;
      this.dataSubscription = this.$data.take(1).subscribe((data: Item[]) => {
        this.source = SourceFactory.getInstance(this.sourceType, data, this.disabledItemMapper);
        this.onChangeData.emit(this.source.getDataItems());
        this.updatingData = false;
      });
    }
    if (changes.$appendData && changes.$appendData.currentValue) {
      this.appendingData = true;
      this.appendDataSubscription = this.$appendData.take(1).subscribe(data => {
        this.source.appendDataItems(data);
        this.onChangeData.emit(this.source.getDataItems());
        this.appendingData = false;
      });
    }
    if (changes.selection && changes.selection.currentValue) {
      this.source.updateSelection(this.selection);
    }
  }

  ngOnInit() {
    this.keyEventsSubscription = this.keyEvents.subscribe((event) => {
      this.onKeyPress(event);
    });
  }

  ngOnDestroy(): void {
    this.keyEventsSubscription.unsubscribe();
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
    this.onSelectItem.emit(sourceItem);
  }

  onPaginationClick($event: MouseEvent): void {
    $event.preventDefault();
    this.onNextPage.emit();
  }
  // TODO превратить в настраиваемый интерфейс
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER && this.source.getHighlited() && !this.isHidden()) {
      this.onSelectItem.emit(this.source.getHighlited());
    }
    if (event.keyCode === KEY_CODE.UP_ARROW) {
      const currentIndex = this.source.getEnabledSourceItems().indexOf(this.source.getHighlited());
      if (currentIndex && currentIndex > 0) {
        this.source.setHighlited(this.source.getEnabledSourceItems()[currentIndex - 1]);
      }
      const item = this.getActiveLi();
      if (item) {
        const top = this.getLiTopPosition(item);
        if (top < (this.ul.nativeElement.scrollTop)) {
          this.ul.nativeElement.scrollTop -= this.getLiHeight(item);
        }
      }
    }
    if (event.keyCode === KEY_CODE.DOWN_ARROW) {
      const currentIndex = this.source.getEnabledSourceItems().indexOf(this.source.getHighlited());
      if (currentIndex < this.source.getEnabledSourceItems().length - 1) {
        this.source.setHighlited(this.source.getEnabledSourceItems()[currentIndex + 1]);
      }
      const item = this.getActiveLi();
      if (item) {
        const bottom = this.getLiBottomPosition(item);
        if (bottom > (this.ul.nativeElement.offsetHeight + this.ul.nativeElement.scrollTop)) {
          this.ul.nativeElement.scrollTop += this.getLiHeight(item);
        }
      }
    }
  }

  hasScroll(): boolean {
    const ul = this.ul.nativeElement;
    return ul.scrollHeight > ul.clientHeight;
  }

  public scrollToSelection(): void {
    const selectionList = this.itemList.filter((li: ElementRef) => {
      return li.nativeElement.classList.contains('selected');
    });
    if (selectionList.length > 0) {
      const lastSelectedLi = selectionList[selectionList.length - 1];
      this.ul.nativeElement.scrollTop = this.getLiTopPosition(lastSelectedLi);
    }
  }

  public scrollToTheBottom(): void {
    this.ul.nativeElement.scrollTop = this.ul.nativeElement.scrollHeight;
  }

  private scrollExhausted(): boolean {
    const ul = this.ul.nativeElement;
    return Math.abs(Math.round(ul.offsetHeight + ul.scrollTop) - Math.round(ul.scrollHeight)) === 0;
  }

  private getActiveLi(): ElementRef|null {
    const activeList = this.itemList.filter((li: ElementRef) => {
      return li.nativeElement.classList.contains('active');
    });
    if (activeList.length > 0) {
      return activeList[0];
    } else {
      return null;
    }
  }

  private getLiHeight(li: ElementRef): number {
    return li.nativeElement.offsetHeight;
  }

  private getLiBottomPosition(li: ElementRef): number {
    return this.getLiTopPosition(li) + this.getLiHeight(li);
  }

  private getLiTopPosition(li: ElementRef): number {
    return li.nativeElement.offsetTop;
  }

  private isHidden() {
    return (this.ul.nativeElement.offsetParent === null);
  }
}
