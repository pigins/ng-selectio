import {
  ChangeDetectorRef,
  Component, ElementRef, EventEmitter, Input, NgZone, OnChanges, OnDestroy, OnInit, Output, QueryList, Renderer2,
  SimpleChanges,
  ViewChild, ViewChildren
} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import {FormControl, FormGroup} from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/take';
import {Subscription} from 'rxjs/Subscription';
import {ItemComponent} from './item.component';

export enum KEY_CODE {
  UP_ARROW = 38,
  DOWN_ARROW = 40,
  ENTER = 13,
  BACKSPACE = 8
}

export const SELECTION_MODE_SINGLE = 'single';
export const SELECTION_MODE_MULTIPLE = 'multiple';

@Component({
  selector: 'app-ng-selectio',
  template: `
    <div [ngClass]="{'ngs': true, 'ngs-expanded': expanded}" #ngs tabindex="1" (blur)="onBlur($event)"
         (keydown)="onKeyPress($event)">

      <div [ngClass]="{'autocomplete': autocomplete}">
        <selection #selectionComponent
                   [items]="selection"
                   [highlightedItem]="highlightedItem"
                   [itemRenderer]="selectionItemRenderer"
                   [bypassSecurityTrustHtml]="bypassSecurityTrustHtml"
                   [selectionMode]="selectionMode"
                   [showArrow]="!autocomplete"
                   [showEmptySelection]="!autocomplete"
                   [deletable]="selectionDeletable"
                   (click)="onClickSelection($event)"
                   (onDeleteItem)="onDeleteItem($event)"
                   (onHighlightItem)="onHighlightItem($event)"
        >
        </selection>
        <div [ngStyle]="{'display': showSearch && expanded ? 'block' : 'none'}" class="ngs-search"
             [formGroup]="textInputGroup">
          <input formControlName="textInput" type="text" #search
                 (blur)="onBlur($event)"
                 (keydown)="onTextInputKeyDown($event)"
          />
        </div>
      </div>

      <div class="ngs-data" #dropdown>
        <ul #ul (scroll)="onUlScroll($event)">
          <ng-selectio-item *ngFor="let dataItem of data;" #itemList
                            [isActive]="dataItem === activeListItem"
                            [isSelected]="insideSelection(dataItem)"
                            [data]="dataItem"
                            [bypassSecurityTrustHtml]="bypassSecurityTrustHtml"
                            [renderItem]="dropdownItemRenderer"
                            (mouseenter)="activeListItem = dataItem"
                            (click)="selectItem(dataItem)"
          >
          </ng-selectio-item>
          <li *ngIf="data.length === 0">
            No data
          </li>
          <li *ngIf="loadingMoreResults">
            Loading more results...
          </li>
        </ul>
      </div>

    </div>
  `,
  styleUrls: ['./ng-selectio.component.css']
})
export class NgSelectioComponent implements OnInit, OnChanges, OnDestroy {

  @Input() $data: Observable<any> = Observable.empty();
  @Input() $appendData: Observable<any> = Observable.empty();
  @Input() selection = [];
  @Input() selectionMode = SELECTION_MODE_SINGLE;
  @Input() defaultSelectionRule: (item: any[]) => any[] = (items: any[]) => {return []};
  @Input() bypassSecurityTrustHtml: boolean = false;
  @Input() delay: number = 0;
  @Input() minLengthForAutocomplete: number = 0;
  @Input() dropdownItemRenderer: (item: any) => string = (item: any) => {return JSON.stringify(item)};
  @Input() selectionItemRenderer: (item: any) => string = (item: any) => {return JSON.stringify(item)};
  @Input() showSearch: boolean = false;
  @Input() selectionDeletable: boolean = false;
  @Input() pagingDelay: number = 0;
  @Input() paging: boolean = false;
  @Input() autocomplete: boolean = false;

  @Output() onSearch = new EventEmitter<any>();
  @Output() onNextPage = new EventEmitter<any>();
  @Output() onSelect = new EventEmitter<any>();



  @ViewChild('dropdown') dropdown: ElementRef;
  @ViewChild('search') search: ElementRef;
  @ViewChild('ngs') ngs: ElementRef;
  @ViewChild('ul') ul: ElementRef;
  @ViewChildren('itemList') itemList: QueryList<ItemComponent>;

  data: any = [];
  highlightedItem: any = null;
  textInputGroup: FormGroup;
  textInput: FormControl;
  activeListItem: any;
  expanded: boolean;
  loadingMoreResults: boolean = false;
  private searchTextChangeSubscription: Subscription;
  private expandedChangedSubscription: Subscription;
  private expandedChanged = new EventEmitter<boolean>();


  constructor(private _ngZone: NgZone, private changeDetectorRef: ChangeDetectorRef, private renderer: Renderer2) {
    this.textInput = new FormControl();
    this.textInputGroup = new FormGroup({
      textInput: this.textInput
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.defaultSelectionRule) {
      if (this.selectionMode === SELECTION_MODE_SINGLE) {

      }
    }
    if (changes.$data) {
      if (this.$data) {
        this.$data.take(1).subscribe((data) => {
          this.data = data;
          if (this.autocomplete && changes.$data.previousValue && this.textInput.value) {
            this.expanded = true;
          }
        });
      }
    }
    if (changes.$appendData) {
      if (this.$appendData) {
        this.$appendData.take(1).subscribe((data) => {
          this.data = this.data.concat(data);
          this.loadingMoreResults = false;
        });
      }
    }
  }

  ngOnInit() {
    this.searchTextChangeSubscription = this.textInput.valueChanges
      .debounceTime(this.delay)
      .filter(e => this.textInput.value.length >= this.minLengthForAutocomplete)
      .subscribe(v => {
        this.onSearch.emit(v);
      });

    if (!this.$data) {
      this.$data = Observable.empty();
    }

    this.expandedChangedSubscription = this.expandedChanged.subscribe((expanded: boolean) => {
      this.expanded = expanded;
      this._ngZone.runOutsideAngular(() => {
        setTimeout(() => this.search.nativeElement.focus(), 0);
      });
    });

    if (this.defaultSelectionRule) {
      this.selection = this.defaultSelectionRule(this.data);
    }

    if (this.selection.length > 0) {
      this.selection.forEach((item) => {
        this.onSelect.emit(item);
      });
    }

    this.onSelect.subscribe(() => {
      this.textInput.setValue('');
      // if (this.autocomplete) {
      //   this.textInput.setValue('', {onlySelf: true, emitEvent: false});
      // } else {
      //   this.textInput.setValue('');
      // }
    });

    // if (this.autocomplete) {
    //   this.textInput.valueChanges.subscribe((value) => {
    //     console.log(value);
    //   })
    // }

  }

  ngOnDestroy(): void {
    this.expandedChangedSubscription.unsubscribe();
    this.searchTextChangeSubscription.unsubscribe();
  }

  onClickSelection() {
    if (!this.autocomplete) {
      this.expandedChanged.emit(!this.expanded);
    }
  }

  selectItem(item: any) {
    if (this.selectionMode === SELECTION_MODE_SINGLE) {
      this.selection = [item];
    } else if (this.selectionMode === SELECTION_MODE_MULTIPLE) {
      this.selection.push(item);
    }
    this.expandedChanged.emit(false);
    this.onSelect.emit(item);
  }

  onBlur($event: Event) {
    if ($event) {
      let e = (<any>$event);
      if (e.relatedTarget) {
        if (e.relatedTarget === this.search.nativeElement || e.relatedTarget === this.ngs.nativeElement) {
          /*NOPE*/
        } else {
          if (this.expanded) {
            this.expandedChanged.emit(false);
          }
        }
      } else {
        if (this.expanded) {
          this.expandedChanged.emit(false);
        }
      }
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      if (this.expanded) {
        if (this.activeListItem) {
          this.selectItem(this.activeListItem);
        }
      }
    }
    if (event.keyCode === KEY_CODE.UP_ARROW) {
      if (this.expanded) {
        let currentIndex = this.data.indexOf(this.activeListItem);
        if (currentIndex && currentIndex > 0) {
          this.activeListItem = this.data[currentIndex - 1];
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
        let currentIndex = this.data.indexOf(this.activeListItem);
        if (currentIndex < this.data.length - 1) {
          this.activeListItem = this.data[currentIndex + 1];
        }
        let item = this.getActiveItemComponent();
        if (item) {
          let bottom = item.getBottomPosition();
          if (bottom > (this.ul.nativeElement.offsetHeight + this.ul.nativeElement.scrollTop)) {
            this.ul.nativeElement.scrollTop += item.getHeight();
          }
        }
      } else {
        if (this.hasFocus()) {
          this.expandedChanged.emit(true);
        }
      }
    }
  }

  onUlScroll() {
    if (!this.paging) {
      return;
    }
    if(this.scrollExhausted() && !this.loadingMoreResults) {
      this.loadingMoreResults = true;
      this.changeDetectorRef.detectChanges();
      this.scrollToTheBottom();
      setTimeout(() => {
        this.onNextPage.emit({currentLength: this.data.length, search: this.textInput.value});
      }, this.pagingDelay);
    }
  }

  onDeleteItem(_item: any) {
    this.selection = this.selection.filter(item => item !== _item);
  }

  onHighlightItem(_item: any) {
    this.highlightedItem = _item;
  }

  onTextInputKeyDown(event: KeyboardEvent) {
    if (this.autocomplete) {
      if (event.keyCode === KEY_CODE.BACKSPACE && !this.textInput.value) {
        if (!this.highlightedItem) {
          this.highlightedItem = this.selection[this.selection.length - 1];
        } else {
          this.selection = this.selection.filter(item => item !== this.highlightedItem);
          this.highlightedItem = null;
        }
      }
    }
  }

  private scrollToTheBottom() {
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

  insideSelection(item: any): boolean {
    for (let i = 0; i < this.selection.length; i++) {
      if (item === this.selection[i]) {
        return true;
      }
    }
    return false;
  }

  private hasFocus(): boolean {
    if (document.activeElement) {
      return document.activeElement === this.ngs.nativeElement || document.activeElement === this.search.nativeElement;
    } else {
      return false;
    }
  }

}
