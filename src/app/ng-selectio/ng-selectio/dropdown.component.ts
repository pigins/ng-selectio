import {
  Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges,
  ViewChild, ViewChildren
} from '@angular/core';
import {KEY_CODE} from "./ng-selectio.component";
import {ItemComponent} from "./item.component";
import {Observable} from "rxjs/Observable";
import {Template} from "./template";
import {Item} from "./item";


@Component({
  selector: 'ng-selectio-dropdown',
  template: `
    <div [ngClass]="{'ngs-data': true, 'ngs-expanded': !disabled && expanded}" #dropdown>
      <ul #ul (scroll)="onUlScroll($event)" [ngStyle]="{'max-height': maxHeight, 'bottom': openOnTop ? 0: 'auto', 'top': !openOnTop ? 0: 'auto'}">
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
    .ngs-data {
      display: none;
      position: relative;
    }
    /*.ngs-data.ngs-expanded {*/
      /*display: block;*/
    /*}*/
    .ngs-data.ngs-expanded {
      display: block;
    }

    .ngs-data ul {
      position: absolute;
      left: 0;
      z-index: 9999999;
      list-style-type: none;
      background-color: aliceblue;
      margin: 0;
      padding: 0;
      width: 100%;
      overflow-y: auto;
    }
   `]
})
export class DropdownComponent implements OnInit, OnChanges {
  // self inputs
  @Input() data: Item[];
  @Input() selection: Item[];
  @Input() loadingMoreResults: boolean;
  @Input() searching: boolean;
  @Input() pagingDelay: number;
  @Input() paging: boolean;
  @Input() trackByFn: (index: number, item:Item) => any;
  @Input() openOnTop: boolean;

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
  @Input() disabled: false;

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
      this.enabledData = this.data.filter((dataElem) => {
        return !this.disabledItemMapper(dataElem);
      });
    }
  }

  ngOnInit() {
    this.keyEvents.subscribe((event) => {
      this.onKeyPress(event);
    });
  }

  onUlScroll() {
    if (!this.paging) {
      return;
    }
    if(this.scrollExhausted() && !this.loadingMoreResults) {
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
        let currentIndex = this.enabledData.indexOf(this.activeListItem);

        if (currentIndex && currentIndex > 0) {
          this.activeListItem = this.enabledData[currentIndex - 1];
        }
        let item = this.getActiveItemComponent();
        if (item) {
          let top = item.getTopPosition();
          if (top < (this.ul.nativeElement.scrollTop)) {
            this.ul.nativeElement.scrollTop -= item.getHeight();
          }
        }
      }
    }
    if (event.keyCode === KEY_CODE.DOWN_ARROW) {
      if (this.expanded) {
        let currentIndex = this.enabledData.indexOf(this.activeListItem);
        if (currentIndex < this.enabledData.length - 1) {
          this.activeListItem = this.enabledData[currentIndex + 1];
        }
        let item = this.getActiveItemComponent();
        if (item) {
          let bottom = item.getBottomPosition();
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
    let ul = this.ul.nativeElement;
    return Math.abs(Math.round(ul.offsetHeight + ul.scrollTop) - Math.round(ul.scrollHeight)) === 0;
  }

  private getActiveItemComponent(): ItemComponent {
    let activeLis = this.itemList.filter((item: ItemComponent) => {
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
