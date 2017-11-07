import {
  ChangeDetectorRef,
  Component, ElementRef, EventEmitter, Input, NgZone, OnChanges, OnDestroy, OnInit, Output, QueryList, Renderer,
  Renderer2,
  SimpleChanges,
  ViewChild, ViewChildren
} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/empty';
import {FormControl, FormGroup} from "@angular/forms";
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/take';
import {Subscription} from "rxjs/Subscription";
import {ItemComponent} from "./item.component";


export enum KEY_CODE {
  UP_ARROW = 38,
  DOWN_ARROW = 40,
  ENTER = 13
}

@Component({
  selector: 'app-ng-selectio',
  template: `
    <div [ngClass]="{'ngs': true, 'ngs-expanded': expanded}" #ngs tabindex="1" (blur)="onBlur($event)"
         (keydown)="onKeyPress($event)">


      <selection (click)="onClickSelection($event)">
        
      </selection>
      
      <div class="ngs-selection" (click)="onClickSelection($event)">
        <span class="selection" [innerHtml]="bypassSecurityTrustHtml ? ((renderSelection(selection)) | safeHtml) : (renderSelection(selection))"></span>
        <span class="arrow"></span>
      </div>
      
      
      
      <div [ngStyle]="{'display': showSearch && expanded ? 'block' : 'none'}" class="ngs-search"
           [formGroup]="textInputGroup">
        <input formControlName="textInput" type="text" #search (blur)="onBlur($event)"/>
      </div>

      <div class="ngs-data" #dropdown>
        <ul #ul>
          <ng-selectio-item *ngFor="let dataItem of data;" #itemList
                            [isActive]="dataItem === activeListItem"
                            [isSelected]="insideSelection(dataItem)"
                            [data]="dataItem"
                            [bypassSecurityTrustHtml]="bypassSecurityTrustHtml"
                            [renderItem]="renderItem"
                            (mouseenter)="activeListItem = dataItem"
                            (click)="selectItem(dataItem)"
          >
          </ng-selectio-item>
          <li *ngIf="data.length === 0">
            No data
          </li>
        </ul>
      </div>

    </div>
  `,
  styleUrls: ['./ng-selectio.component.css']
})
export class NgSelectioComponent implements OnInit, OnChanges, OnDestroy {

  @Input() maxVisibleItemsCount: number = 5;
  @Input() expandedOnInit = false;
  @Input() $data: Observable<any> = Observable.empty();
  @Input() selection = [];
  @Input() defaultSelectionRule;
  @Input() bypassSecurityTrustHtml: boolean = false;
  @Input() delayedSettings;
  @Input() delay: number = 0;
  @Input() minLengthForAutocomplete: number = 0;
  @Input() multiple: boolean = false;
  @Input() renderItem: (item: any) => string;
  @Input() renderSelectionItem: (item: any) => string;
  @Input() showSearch: boolean = false;
  @Input() hideSelection: boolean = false;

  @Output() onSearch = new EventEmitter<any>();
  @Output() onNextPage = new EventEmitter<any>();
  @Output() onSelect = new EventEmitter<any>();

  @ViewChild('dropdown') dropdown: ElementRef;
  @ViewChild('search') search: ElementRef;
  @ViewChild('ngs') ngs: ElementRef;
  @ViewChild('ul') ul: ElementRef;
  @ViewChildren('itemList') itemList: QueryList<ItemComponent>;

  data: any = [];
  textInputGroup: FormGroup;
  textInput: FormControl;
  activeListItem: any;
  expanded: boolean;
  private searchTextChangeSubscription: Subscription;
  private expandedChangedSubscription: Subscription;
  private expandedChanged = new EventEmitter<boolean>();

  constructor(private _ngZone: NgZone, private changeDetectorRef: ChangeDetectorRef, private renderer: Renderer2) {
    this.textInput = new FormControl();
    this.textInputGroup = new FormGroup({
      textInput: this.textInput
    });
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
      if (expanded) {
        this.textInput.setValue('');
        this._ngZone.runOutsideAngular(() => {
          setTimeout(() => this.search.nativeElement.focus(), 0);
        });
      } else {
        this._ngZone.runOutsideAngular(() => {
          setTimeout(() => this.ngs.nativeElement.focus(), 0);
        });
      }
    });

    if (this.selection.length > 0) {
      this.selection.forEach((item) => {
        this.onSelect.emit(item);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.$data) {
      if (this.$data) {
        this.$data.take(1).subscribe((data) => {
          this.data = data;
          if (this.defaultSelectionRule) {
            this.selection = this.data.filter(dataElem => {
              return this.defaultSelectionRule(dataElem);
            });
          }
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.expandedChangedSubscription.unsubscribe();
    this.searchTextChangeSubscription.unsubscribe();
  }

  onClickSelection() {
    this.expandedChanged.emit(!this.expanded);
  }
  // TODO add cross for delete elem
  renderSelection(): string {
    // FIXME
    let renderFn = this.renderSelectionItem ? this.renderSelectionItem : (item) => {
      return JSON.stringify(item)
    };

    if (!this.selection) {
      return;
    } else if (this.selection.length === 0) {
      return `<span>No selection</span>`;
    } else if (this.isSingleMode()) {
      if (this.selection.length > 1) {
        throw new Error('selection length > 1 for single selection mode');
      }
      return renderFn(this.selection[0]);
    } else if (this.isMultipleMode()) {
      return this.selection.map(item => {
        return `<span class="test-class">${renderFn(item)}</span>`;
      }).join('');
    }
  }

  selectItem(item: any) {
    if (this.isSingleMode()) {
      this.selection = [item];
    } else if (this.isMultipleMode()) {
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

  private isMultipleMode(): boolean {
    return this.multiple;
  }

  private isSingleMode(): boolean {
    return !this.isMultipleMode();
  }

  private hasFocus(): boolean {
    if (document.activeElement) {
      return document.activeElement === this.ngs.nativeElement || document.activeElement === this.search.nativeElement;
    } else {
      return false;
    }
  }

}
