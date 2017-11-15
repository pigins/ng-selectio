import {
  ChangeDetectorRef,
  Component, ElementRef, EventEmitter, Input, NgZone, OnChanges, OnDestroy, OnInit, Output, SimpleChanges,
  ViewChild} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import {FormControl, FormGroup} from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/take';
import {Subscription} from 'rxjs/Subscription';
import {ListComponent} from "./list.component";

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
    
    <div class="ngs" #ngs tabindex="1" (blur)="onBlur($event)" (keydown)="onKeyPress($event)">

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
      
      <ng-selectio-list #listComponent
        [data]="data"
        [selection]="selection"
        [expanded]="expanded"
        [loadingMoreResults]="loadingMoreResults"
        [bypassSecurityTrustHtml]="bypassSecurityTrustHtml"
        [renderItem]="dropdownItemRenderer"
        [keyEvents]="keyEvents"              
        [paging]="paging"                         
        (onSelectItem)="selectItem($event)"
        (onNextPage)="onNextPageStart()"
      >
      </ng-selectio-list>

    </div>
  `,
  styles: [`
    .ngs {
      border: 1px solid grey;
    }
    .autocomplete > * {
      display: inline-block !important;
    }
    .autocomplete input {
      border: none;
    }
    .autocomplete input:focus {
      outline: none;
    }
  `]
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

  @ViewChild('search') search: ElementRef;
  @ViewChild('ngs') ngs: ElementRef;
  @ViewChild('listComponent') listComponent: ListComponent;

  data: any = [];
  highlightedItem: any = null;
  textInputGroup: FormGroup;
  textInput: FormControl;
  expanded: boolean;
  loadingMoreResults: boolean = false;
  private searchTextChangeSubscription: Subscription;
  private expandedChangedSubscription: Subscription;
  private expandedChanged = new EventEmitter<boolean>();
  keyEvents = new EventEmitter<KeyboardEvent>()

  constructor(private _ngZone: NgZone, private changeDetectorRef: ChangeDetectorRef) {
    this.textInput = new FormControl();
    this.textInputGroup = new FormGroup({
      textInput: this.textInput
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
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
      if (this.expanded) {
        this._ngZone.runOutsideAngular(() => {
          setTimeout(() => this.search.nativeElement.focus(), 0);
        });
      }
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
    });
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
    if (event.keyCode === KEY_CODE.DOWN_ARROW && !this.expanded && this.hasFocus()) {
      this.expandedChanged.emit(true);
    }
    this.keyEvents.emit(event);
  }

  onNextPageStart() {
    this.loadingMoreResults = true;
    this.changeDetectorRef.detectChanges();
    this.listComponent.scrollToTheBottom();
    setTimeout(() => {
      this.onNextPage.emit({currentLength: this.data.length, search: this.textInput.value});
    }, this.pagingDelay);
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

  private hasFocus(): boolean {
    if (document.activeElement) {
      return document.activeElement === this.ngs.nativeElement || document.activeElement === this.search.nativeElement;
    } else {
      return false;
    }
  }

}
