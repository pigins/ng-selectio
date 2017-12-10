import {
  Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges,
  ViewChild, NgZone,
} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'ng-selectio-search',
  template: `
    <div [ngClass]="{'ngs-search': true, 'autocomplete': autocomplete}"
         [formGroup]="textInputGroup">
      <input formControlName="textInput" type="text" #search [attr.placeholder]="searchPlaceholder"
             (blur)="onSearchBlur.emit($event)"
             (keydown)="onSearchKeyDown.emit($event)"
      />
    </div>
  `,
  styles: [`
    .autocomplete input {
      border: none;
    }
    .autocomplete input:focus {
      outline: none;
    }
  `]
})
export class SearchComponent implements OnChanges, OnInit, OnDestroy {

  @Input() autocomplete: boolean;
  @Input() searchPlaceholder: string;
  @Input() disabled: boolean;
  @Input() searchDelay: number;
  @Input() searchMinLength: number;

  @Output() onSearchBlur = new EventEmitter<Event>();
  @Output() onSearchKeyDown = new EventEmitter<KeyboardEvent>();
  @Output() onSearchValueChanges = new EventEmitter<string>();

  @ViewChild('search') search: ElementRef;

  constructor(private _ngZone: NgZone) {
    this.textInput = new FormControl({value: '', disabled: this.disabled});
    this.textInputGroup = new FormGroup({
      textInput: this.textInput
    });
  }

  textInputGroup: FormGroup;
  textInput: FormControl;
  private searchTextChangeSubscription: Subscription;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.disabled) {
      if (this.disabled) {
        this.textInput.disable();
      } else {
        this.textInput.enable();
      }
    }
  }

  ngOnInit(): void {
    this.searchTextChangeSubscription = this.textInput.valueChanges
      .debounceTime(this.searchDelay)
      .filter(e => this.textInput.value.length >= this.searchMinLength)
      .subscribe((v: string) => {
        this.onSearchValueChanges.emit(v);
      });
  }

  ngOnDestroy(): void {
    this.searchTextChangeSubscription.unsubscribe();
  }

  public notEmpty(): boolean {
    return !!this.textInput.value;
  }

  public focus(): void {
    this._ngZone.runOutsideAngular(() => {
      setTimeout(() => this.search.nativeElement.focus(), 0);
    });
  }

  public empty(): void {
    this.textInput.setValue('');
  }

  public getNativeElement() {
    return this.search.nativeElement;
  }

  public getValue() {
    return this.textInput.value;
  }
}
