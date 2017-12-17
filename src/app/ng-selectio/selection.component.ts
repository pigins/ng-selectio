import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {SELECTION_MODE_SINGLE} from './ng-selectio.component';
import {SELECTION_MODE_MULTIPLE} from './ng-selectio.component';
import {Template} from './types';
import {Item} from './types';
import {SelectionMode} from './types';

@Component({
  selector: 'selection',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [ngStyle]="{'position': 'relative'}" [ngClass]="{'selection': true}">
      
      <div *ngIf="this.items.length === 0" class="empty">
        <span [innerHtml]="emptyRenderer | template"></span>
      </div>
      
      <div *ngIf="singleMode() && !deletable" class="single">
        <div
          [ngClass]="{'single': true, 'selected': highlightedItem === items[0]}"
          [innerHtml]="itemRenderer | template:items[0]">
        </div>
      </div>
      
      <div *ngIf="singleMode() && deletable && items.length === 1" class="single deletable">
        <div [ngClass]="{'single': true, 'selected': highlightedItem === items[0]}">
          <span [innerHtml]="itemRenderer | template:items[0]" class="single-item"></span>
          <span class="clear" 
                (click)="onDeleteClick($event, items[0])"
                [innerHtml]="clearRenderer | template"
          ></span>
        </div>
      </div>
      
      <div *ngIf="multipleMode() && !deletable" class="multiple">
        <div *ngFor="let item of items;" 
             [ngStyle]="{'display': 'inline-block'}"
             [ngClass]="{'selected': highlightedItem === item}"
             [innerHtml]="itemRenderer | template:item"
             (click)="highlight(item)">
        </div>
      </div>
      
      <div *ngIf="multipleMode() && deletable" class="multiple deletable">
        <div *ngFor="let item of items" 
             [ngStyle]="{'display': 'inline-block'}"
             [ngClass]="{'selected': highlightedItem === item}"
             (click)="highlight(item)">
          <span class="clear" 
                (click)="onDeleteClick($event, item)" 
                [innerHtml]="clearRenderer | template"
          ></span>
          <span [innerHtml]="itemRenderer | template:item"></span>
        </div>
      </div>
      
      <span *ngIf="showArrow" [ngClass]="{'arrow': true, 'up-arrow': arrowDirection}"></span>
      
    </div>
  `
})
export class SelectionComponent {
  @Input() items: Item[];
  @Input() highlightedItem: Item;
  @Input() emptyRenderer: Template<() => string>;
  @Input() clearRenderer: Template<() => string>;
  @Input() itemRenderer: Template<(item: Item) => string>;
  @Input() selectionMode: SelectionMode;
  @Input() deletable: boolean;
  @Input() showArrow: boolean;
  @Input() arrowDirection: boolean;
  @Input() disabled: boolean;

  @Output() onDeleteItem = new EventEmitter<Item>();
  @Output() onHighlightItem = new EventEmitter<Item>();

  constructor() {
  }

  singleMode() {
    return this.selectionMode === SELECTION_MODE_SINGLE;
  }

  multipleMode() {
    return this.selectionMode === SELECTION_MODE_MULTIPLE;
  }

  onDeleteClick(event: MouseEvent, item: Item) {
    if (this.disabled) {
      return;
    }
    event.stopPropagation();
    this.onDeleteItem.emit(item);
  }

  highlight(item: Item) {
    if (this.disabled) {
      return;
    }
    if (this.highlightedItem !== item) {
      this.onHighlightItem.emit(item);
    }
  }
}
