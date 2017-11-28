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
import {DropdownComponent} from "./dropdown.component";
import {Template} from "./template";

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
                   [emptyRenderer]="autocomplete ? null : selectionEmptyRenderer"
                   [selectionMode]="selectionMode"
                   [showArrow]="!autocomplete"
                   [deletable]="selectionDeletable"
                   [disabled]="disabled"
                   (click)="onClickSelection($event)"
                   (onDeleteItem)="onDeleteItem($event)"
                   (onHighlightItem)="onHighlightItem($event)"
        >
        </selection>
        <div class="ngs-search"
             [ngStyle]="{'display': showSearch && expanded ? 'block' : 'none'}"
             [formGroup]="textInputGroup">
          <input formControlName="textInput" type="text" #search [attr.placeholder]="placeholder"
                 (blur)="onBlur($event)"
                 (keydown)="onTextInputKeyDown($event)"
          />
        </div>
      </div>

      <ng-selectio-dropdown #dropdownComponent
                            [data]="data"
                            [selection]="selection"
                            [expanded]="expanded"
                            [loadingMoreResults]="loadingMoreResults"
                            [searching]="searching"
                            [bypassSecurityTrustHtml]="bypassSecurityTrustHtml"
                            [maxHeight] = "dropdownMaxHeight"
                            [itemRenderer]="dropdownItemRenderer"
                            [disabledItemMapper]="dropdownDisabledItemMapper"
                            [emptyRenderer]="dropdownEmptyRenderer"
                            [pagingMessageRenderer]="dropdownPagingMessageRenderer"
                            [searchingRenderer]="dropdownSearchingRenderer"
                            [keyEvents]="keyEvents"
                            [paging]="paging"
                            [disabled]="disabled"
                            (onSelectItem)="selectItem($event)"
                            (onNextPage)="onNextPageStart()"
      >
      </ng-selectio-dropdown>

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
  @Input() bypassSecurityTrustHtml: boolean = false;
  @Input() searchDelay: number = 0;
  @Input() minLengthForAutocomplete: number = 0;
  @Input() showSearch: boolean = false;
  @Input() pagingDelay: number = 0;
  @Input() paging: boolean = false;
  @Input() autocomplete: boolean = false;
  @Input() disabled = false;
  @Input() closeOnSelect = true;
  @Input() maxSelectionLength: number = -1;
  @Input() defaultSelectionRule: (item: any[]) => any[] = (items: any[]) => {return []};
  @Input() selectionDeletable: boolean;
  @Input() dropdownDisabledItemMapper: (item: any) => boolean = (item: any) => {return false};

  // templates
  static defaultItemRenderer = (item: any) => {
    if (typeof item === "string") {
      return item;
    } else if (typeof item === "number") {
      return item + '';
    } else {
      return JSON.stringify(item);
    }
  };
  @Input() dropdownItemRenderer: Template<(countryItem: any, disabled: boolean) => string> = NgSelectioComponent.defaultItemRenderer;
  @Input() selectionItemRenderer: Template<(item: any) => string> = NgSelectioComponent.defaultItemRenderer;
  @Input() dropdownMaxHeight: '100px';
  @Input() placeholder: string = '';
  @Input() dropdownEmptyRenderer: Template<() => string> = 'Enter 1 or more characters';
  @Input() dropdownPagingMessageRenderer: Template<() => string> = 'Loading more results...';
  @Input() dropdownSearchingRenderer: Template<() => string> = 'Searching...';
  @Input() selectionEmptyRenderer: Template<() => string> = 'No data';

  @Output() onSearch = new EventEmitter<any>();
  @Output() onNextPage = new EventEmitter<any>();
  @Output() onSelect = new EventEmitter<any>();

  @ViewChild('search') search: ElementRef;
  @ViewChild('ngs') ngs: ElementRef;
  @ViewChild('dropdownComponent') dropdownComponent: DropdownComponent;

  data: any = [];
  highlightedItem: any = null;
  textInputGroup: FormGroup;
  textInput: FormControl;
  expanded: boolean;
  loadingMoreResults: boolean = false;
  searching: boolean = false;
  keyEvents = new EventEmitter<KeyboardEvent>();
  private searchTextChangeSubscription: Subscription;
  private expandedChangedSubscription: Subscription;
  private expandedChanged = new EventEmitter<boolean>();

  constructor(private _ngZone: NgZone, private changeDetectorRef: ChangeDetectorRef) {
    this.textInput = new FormControl({value: '', disabled: this.disabled});
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
          this.searching = false;
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
    if (changes.disabled) {
      if (this.disabled) {
        this.textInput.disable();
      } else {
        this.textInput.enable();
      }
    }
  }

  ngOnInit() {
    this.searchTextChangeSubscription = this.textInput.valueChanges
      .debounceTime(this.searchDelay)
      .filter(e => this.textInput.value.length >= this.minLengthForAutocomplete)
      .subscribe(v => {
        this.onSearch.emit(v);
        this.searching = true;
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
      if (this.maxSelectionLength < 0 || (this.selection.length + 1 <= this.maxSelectionLength)) {
        this.selection.push(item);
      }
    }
    if (this.closeOnSelect) {
      this.expandedChanged.emit(false);
    }
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
    this.dropdownComponent.scrollToTheBottom();
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

  private templateToFunction() {

  }

  public getTextInput() {
    return this.textInput;
  }
}
