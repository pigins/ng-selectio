import {
  Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, TemplateRef,
  ViewChild, ViewChildren
} from '@angular/core';
import {KEY_CODE} from './ng-selectio.component';
import {Observable} from 'rxjs/Observable';
import {Item} from './types';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'list',
  template: `
    
    <ng-template #defaultItemTemplate let-item="item" let-disabled="disabled">
      <span>{{item | defaultItem}}</span>
    </ng-template>
    
    <ng-template #defaultLastLiTemplate let-data="data" let-pagination="pagination" let-appendingData="appendingData" let-searching="searching">
      <li *ngIf="(data.length === 0)">Enter 1 or more characters</li>
      <li *ngIf="pagination && appendingData">Loading more data...</li>
      <li *ngIf="searching">Searching...</li>
    </ng-template>

    <ng-template #defaultAfterUlTemplate let-data="data" let-pagination="pagination" let-hasScroll="hasScroll">
      <span *ngIf="pagination && data.length > 0 && !hasScroll"
            (mousedown)="onPaginationClick($event)">
        Get more...
      </span>
    </ng-template>
    
    <ul #ul
        [ngStyle]="{'max-height': maxHeight, 'list-style-type': 'none', 'overflow-y':'auto', position: 'relative'}"
        (scroll)="onUlScroll($event)" >
      <li #itemList
          *ngFor="let dataItem of data; trackBy: trackByFn" 
          [ngClass]="{'active': !disabledItemMapper(dataItem) && dataItem === activeListItem, 'selected': insideSelection(dataItem), 'disabled': disabledItemMapper(dataItem)}"
          (mouseenter)="activeListItem = dataItem"
          (click)="onClickItem(dataItem)">
        <ng-container *ngTemplateOutlet="itemTemplate ? itemTemplate : defaultItemTemplate;
        context:{item:dataItem, disabled: disabledItemMapper(dataItem)}"></ng-container>
      </li>
      <ng-container *ngTemplateOutlet="lastLiTemplate ? lastLiTemplate : defaultLastLiTemplate;
      context:{data: data, pagination: pagination, appendingData: appendingData, searching: searching}"></ng-container>
    </ul>
    <ng-container *ngTemplateOutlet="afterUlTemplate ? afterUlTemplate : defaultAfterUlTemplate;
    context:{data: data, pagination: pagination, hasScroll: hasScroll()}"></ng-container>
  `
})
export class ListComponent implements OnInit, OnChanges, OnDestroy {

  // inputs
  @Input() $data: Observable<Item[]> = Observable.of([]);
  @Input() $appendData: Observable<Item[]> = Observable.of([]);
  @Input() pagination: boolean;
  @Input() trackByFn: (index: number, item: Item) => any;
  @Input() maxHeight: string;
  @Input() disabledItemMapper: (item: Item) => boolean;

  // external context
  @Input() selection: Item[];
  @Input() searching: boolean;
  @Input() keyEvents: Observable<KeyboardEvent>;

  // templates
  @Input() itemTemplate: TemplateRef<any>;
  @Input() lastLiTemplate: TemplateRef<any>;
  @Input() afterUlTemplate: TemplateRef<any>;

  @Output() onNextPage = new EventEmitter<void>();
  @Output() onSelectItem = new EventEmitter<Item>();
  @Output() onChangeData = new EventEmitter<Item[]>();


  @ViewChild('ul') ul: ElementRef;
  @ViewChildren('itemList') itemList: QueryList<ElementRef>;

  activeListItem: Item;
  enabledData: Item[]; // дубликать надо убрать
  data: Item[] = [];
  keyEventsSubscription: Subscription;
  updatingData: boolean;
  appendingData: boolean;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.$data && changes.$data.currentValue) {
      this.updatingData = true;
      this.$data.take(1).subscribe((data) => {
        this.data = data;
        this.enabledData = data.filter((dataElem: Item) => {
          return !this.disabledItemMapper(dataElem);
        });
        this.onChangeData.emit(this.data);
        this.updatingData = false;
      });
    }
    if (changes.$appendData && changes.$appendData.currentValue) {
      this.appendingData = true;
      this.$appendData.take(1).subscribe((data) => {
        this.data = this.data.concat(data);
        this.onChangeData.emit(this.data);
        this.appendingData = false;
      });
    }
  }

  ngOnInit() {
    this.keyEventsSubscription = this.keyEvents.subscribe((event) => {
      this.onKeyPress(event);
    });
  }

  ngOnDestroy(): void {
    this.keyEventsSubscription.unsubscribe();
  }

  onUlScroll(event: Event) {
    if (this.pagination && this.scrollExhausted() && !this.appendingData) {
      this.onNextPage.emit();
    }
  }

  onClickItem(dataItem: Item) {
    if (this.disabledItemMapper(dataItem)) {
      return;
    }
    this.onSelectItem.emit(dataItem);
  }

  onPaginationClick($event: MouseEvent): void {
    $event.preventDefault();
    this.onNextPage.emit();
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER && this.activeListItem && !this.isHidden()) {
      this.onSelectItem.emit(this.activeListItem);
    }
    if (event.keyCode === KEY_CODE.UP_ARROW) {
      const currentIndex = this.enabledData.indexOf(this.activeListItem);
      if (currentIndex && currentIndex > 0) {
        this.activeListItem = this.enabledData[currentIndex - 1];
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
      const currentIndex = this.enabledData.indexOf(this.activeListItem);
      if (currentIndex < this.enabledData.length - 1) {
        this.activeListItem = this.enabledData[currentIndex + 1];
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

  insideSelection(item: Item): boolean {
    for (let i = 0; i < this.selection.length; i++) {
      if (item === this.selection[i]) {
        return true;
      }
    }
    return false;
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
      let lastSelectedLi = selectionList[selectionList.length - 1];
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
    return (this.ul.nativeElement.offsetParent === null)
  }
}
