import {
  Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges,
  ViewChild, ViewChildren, ViewEncapsulation
} from '@angular/core';
import {KEY_CODE} from './ng-selectio.component';
import {Observable} from 'rxjs/Observable';
import {Template} from './template';
import {Item} from './item';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'list',
  encapsulation: ViewEncapsulation.None,
  template: `
    <ul #ul
        [ngStyle]="{'max-height': maxHeight, 'list-style-type': 'none', 'overflow-y':'auto'}"
        (scroll)="onUlScroll($event)" >
      <li #itemList
          *ngFor="let dataItem of data; trackBy: trackByFn" 
          [ngClass]="{'active': !disabledItemMapper(dataItem) && dataItem === activeListItem, 'selected': insideSelection(dataItem), 'disabled': disabledItemMapper(dataItem)}"
          [innerHtml]="itemRenderer | template:dataItem:disabledItemMapper(dataItem)"
          (mouseenter)="activeListItem = dataItem"
          (click)="onClickItem(dataItem)"
      >
      </li>
      <li *ngIf="(data.length === 0)"
          [innerHtml]="emptyRenderer | template">
      </li>
      <li *ngIf="pagination && loadingMoreResults"
          [innerHtml]="paginationMessageRenderer | template">
      </li>
      <li *ngIf="searching"
          [innerHtml]="searchingRenderer | template">
      </li>
    </ul>
    <span *ngIf="pagination && data.length > 0 && !this.hasScroll()"
          [innerHtml]="paginationButtonRenderer | template"
          (mousedown)="onPaginationClick($event)" 
    >
    </span>
  `
})
export class ListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data: Item[];
  @Input() selection: Item[];
  @Input() loadingMoreResults: boolean;
  @Input() searching: boolean;
  @Input() paginationDelay: number;
  @Input() pagination: boolean;
  @Input() trackByFn: (index: number, item: Item) => any;
  @Input() maxHeight: string;
  @Input() maxItemsCount: number;
  @Input() itemRenderer: Template<(countryItem: Item, disabled: boolean) => string>;
  @Input() emptyRenderer: Template<() => string>;
  @Input() paginationMessageRenderer: Template<() => string>;
  @Input() paginationButtonRenderer: Template<() => string>;
  @Input() searchingRenderer: Template<() => string>;
  @Input() disabledItemMapper: (item: Item) => boolean;
  @Input() scrollToSelectionAfterOpen: boolean;
  @Input() expanded: boolean;
  @Input() keyEvents: Observable<KeyboardEvent>;
  @Input() disabled: boolean;

  @Output() onNextPage = new EventEmitter<void>();
  @Output() onSelectItem = new EventEmitter<Item>();

  @ViewChild('ul') ul: ElementRef;
  @ViewChildren('itemList') itemList: QueryList<ElementRef>;

  activeListItem: Item;
  enabledData: Item[];
  keyEventsSubscription: Subscription;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      this.enabledData = this.data.filter((dataElem: Item) => {
        return !this.disabledItemMapper(dataElem);
      });
    }
    if (changes.expanded && changes.expanded.currentValue && this.itemList) {
      if (this.scrollToSelectionAfterOpen) {
        this.scrollToSelection();
      }
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
    if (!this.pagination) {
      return;
    }
    if (this.scrollExhausted() && !this.loadingMoreResults) {
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
    if (event.keyCode === KEY_CODE.ENTER && this.expanded && this.activeListItem) {
      this.onSelectItem.emit(this.activeListItem);
    }
    if (event.keyCode === KEY_CODE.UP_ARROW) {
      if (this.expanded) {
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
    }
    if (event.keyCode === KEY_CODE.DOWN_ARROW) {
      if (this.expanded) {
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
}
