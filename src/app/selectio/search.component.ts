import {
  Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges,
  ViewChild, NgZone} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {TextWidthService} from './text-width.service';

@Component({
  selector: 'selectio-search',
  template: `
    <div [ngClass]="{'search': true}"
         [formGroup]="textInputGroup">
      <input #search
             formControlName="textInput"
             type="text"
             [tabindex]="tabIndex"
             [attr.placeholder]="searchPlaceholder"
             (focus)="onSearchFocus.emit($event)"
             (blur)="onSearchBlur.emit($event)"
             (keydown)="onSearchKeyDown.emit($event)"
      />
    </div>
  `
})
export class SearchComponent implements OnChanges, OnInit, OnDestroy {

  @Input() autocomplete: boolean;
  @Input() searchPlaceholder: string;
  @Input() disabled: boolean;
  @Input() searchDelay: number;
  @Input() searchMinLength: number;
  @Input() tabIndex: number;

  @Output() onSearchFocus = new EventEmitter<Event>();
  @Output() onSearchBlur = new EventEmitter<Event>();
  @Output() onSearchKeyDown = new EventEmitter<KeyboardEvent>();
  @Output() onSearchValueChanges = new EventEmitter<string>();
  @Output() onSearchMinLengthBorderCrossing = new EventEmitter<boolean>();

  @ViewChild('search') search: ElementRef;

  constructor(private _ngZone: NgZone, private textWidthService: TextWidthService) {
    this.textInput = new FormControl({value: '', disabled: this.disabled});
    this.textInputGroup = new FormGroup({
      textInput: this.textInput
    });
  }

  textInputGroup: FormGroup;
  textInput: FormControl;
  private textChangeSubscription: Subscription;
  private searchTextChangeSubscription: Subscription;
  private searchMinLengthBorderCrossingSubscription: Subscription;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.disabled) {
      if (changes.disabled.currentValue) {
        this.textInput.disable();
      } else {
        this.textInput.enable();
      }
    }
  }

  ngOnInit(): void {
    this.textChangeSubscription = this.textInput.valueChanges.subscribe(text => {
      if (text) {
        this.search.nativeElement.style.width = (this.textWidthService.measureText(text, this.search.nativeElement) + 5) + 'px';
      } else {
        this.search.nativeElement.style.width = 5 + 'px';
      }
    });
    this.searchTextChangeSubscription = this.textInput.valueChanges
      .debounceTime(this.searchDelay)
      .filter(e => this.textInput.value.length >= this.searchMinLength)
      .subscribe((v: string) => {
        this.onSearchValueChanges.emit(v);
      });

    if (this.autocomplete) {
      let inside: boolean = false;
      this.searchMinLengthBorderCrossingSubscription = this.textInput.valueChanges
        .debounceTime(this.searchDelay)
        .subscribe((v: string) => {
          if (this.textInput.value.length >= this.searchMinLength) {
            if (!inside) {
              this.onSearchMinLengthBorderCrossing.emit(true);
              inside = true;
            }
          }
          if (this.textInput.value.length <= this.searchMinLength && inside) {
            this.onSearchMinLengthBorderCrossing.emit(false);
            inside = false;
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.searchTextChangeSubscription.unsubscribe();
    this.textChangeSubscription.unsubscribe();
    if (this.searchMinLengthBorderCrossingSubscription) {
      this.searchMinLengthBorderCrossingSubscription.unsubscribe();
    }
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

  public getTextInput(): FormControl {
    return this.textInput;
  }
}
