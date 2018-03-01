import {Directive, ElementRef, Input} from '@angular/core';
import {SourceItem} from './model/source-item';

@Directive({
  selector: '[sourceItem]'
})
export class SourceItemDirective {
  @Input('sourceItem') item: SourceItem;
  _element: ElementRef;

  constructor(el: ElementRef) {
    this._element = el;
  }

  get element(): ElementRef {
    return this._element;
  }

  get sourceItem(): SourceItem {
    return this.item;
  }

  get height(): number {
    return this._element.nativeElement.offsetHeight;
  }

  get bottomPosition(): number {
    return this.topPosition + this.height;
  }

  get topPosition(): number {
    return this._element.nativeElement.offsetTop;
  }
}
