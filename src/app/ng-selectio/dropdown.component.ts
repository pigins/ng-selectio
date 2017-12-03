import {
  Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges,
  ViewChild, ViewChildren
} from '@angular/core';
import {KEY_CODE} from './ng-selectio.component';
import {ItemComponent} from './item.component';
import {Observable} from 'rxjs/Observable';
import {Template} from './template';
import {Item} from './item';

@Component({
  selector: 'ng-selectio-list',
  template: `
    <div #dropdown>
      <ul #ul (scroll)="onUlScroll($event)" [ngStyle]="{'max-height': maxHeight}">
        <ng-selectio-item *ngFor="let dataItem of data; trackBy: trackByFn" #itemList
                          [isActive]="!disabledItemMapper(dataItem) && dataItem === activeListItem"
                          [isSelected]="insideSelection(dataItem)"
                          [data]="dataItem"
                          [itemRenderer]="itemRenderer"
                          [disabled]="disabledItemMapper(dataItem)"
                          (mouseenter)="activeListItem = dataItem"
                          (click)="onClickItem(dataItem)"
        >
        </ng-selectio-item>
        <li *ngIf="(data.length === 0)"
            [innerHtml]="emptyRenderer | template">
        </li>
        <li *ngIf="loadingMoreResults"
            [innerHtml]="pagingMessageRenderer | template">
        </li>
        <li *ngIf="searching"
            [innerHtml]="searchingRenderer | template">
        </li>
      </ul>
    </div>
  `,
  styles: [`
    ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
      overflow-y: auto;
    }
   `]
})
export class DropdownComponent implements OnInit, OnChanges {
  // self  inputs
  @Input() data: Item[];
  @Input() selection: Item[];
  @Input() loadingMoreResults: boolean;
  @Input() searching: boolean;
  @Input() pagingDelay: number;
  @Input() paging: boolean;
  @Input() trackByFn: (index: number, item: Item) => any;

  // transport inputs
  @Input() maxHeight: string;
  @Input() maxItemsCount: number;
  @Input() itemRenderer: Template<(countryItem: Item, disabled: boolean) => string>;
  @Input() emptyRenderer: Template<() => string>;
  @Input() pagingMessageRenderer: Template<() => string>;
  @Input() searchingRenderer: Template<() => string>;
  @Input() disabledItemMapper: (item: Item) => boolean;

  @Input() expanded: boolean;
  @Input() keyEvents: Observable<KeyboardEvent>;
  @Input() disabled: boolean;

  @Output() onNextPage = new EventEmitter<void>();
  @Output() onSelectItem = new EventEmitter<Item>();

  @ViewChild('ul') ul: ElementRef;
  @ViewChildren('itemList') itemList: QueryList<ItemComponent>;

  activeListItem: Item;
  enabledData: Item[];

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      this.enabledData = this.data.filter((dataElem: Item) => {
        return !this.disabledItemMapper(dataElem);
      });
    }
  }

  ngOnInit() {
    this.keyEvents.subscribe((event) => {
      this.onKeyPress(event);
    });
  }

  onUlScroll(event: Event) {
    if (!this.paging) {
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
        const item = this.getActiveItemComponent();
        if (item) {
          const top = item.getTopPosition();
          if (top < (this.ul.nativeElement.scrollTop)) {
            this.ul.nativeElement.scrollTop -= item.getHeight();
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
        const item = this.getActiveItemComponent();
        if (item) {
          const bottom = item.getBottomPosition();
          if (bottom > (this.ul.nativeElement.offsetHeight + this.ul.nativeElement.scrollTop)) {
            this.ul.nativeElement.scrollTop += item.getHeight();
          }
        }
      }
    }
  }

  public scrollToTheBottom() {
    this.ul.nativeElement.scrollTop = this.ul.nativeElement.scrollHeight;
  }

  private scrollExhausted() {
    const ul = this.ul.nativeElement;
    return Math.abs(Math.round(ul.offsetHeight + ul.scrollTop) - Math.round(ul.scrollHeight)) === 0;
  }

  private getActiveItemComponent(): ItemComponent|null {
    const activeLis = this.itemList.filter((item: ItemComponent) => {
      return item.data === this.activeListItem;
    });
    if (activeLis.length > 0) {
      return activeLis[0];
    } else {
      return null;
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
}
