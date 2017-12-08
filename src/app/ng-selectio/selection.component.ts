import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SELECTION_MODE_SINGLE} from './ng-selectio.component';
import {SELECTION_MODE_MULTIPLE} from './ng-selectio.component';
import {Template} from './template';
import {Item} from './item';

@Component({
  selector: 'selection',
  template: `
    <div [ngClass]="{'ngs-selection': true, 'disabled': disabled}">
      <div *ngIf="this.items.length === 0" class="selection">
        <span [innerHtml]="emptyRenderer | template"></span>
      </div>
      <div *ngIf="singleMode() && !deletable" class="selection">
        <div
          [ngClass]="{'single': true, 'selected': highlightedItem === items[0]}"
          [innerHtml]="itemRenderer | template:items[0]">
        </div>
      </div>
      <div *ngIf="singleMode() && deletable && items.length === 1" class="selection">
        <div [ngClass]="{'single': true, 'selected': highlightedItem === items[0]}">
          <span [innerHtml]="itemRenderer | template:items[0]"></span>
          <span class="delete" (click)="onDeleteClick($event, items[0])">X</span>
        </div>
      </div>
      <div *ngIf="multipleMode() && !deletable" class="selection">
        <div *ngFor="let item of items;"
             [ngClass]="{'multiple': true, 'selected': highlightedItem === item}"
             [innerHtml]="itemRenderer | template:item"
             (click)="highlight(item)">
        </div>
      </div>
      <div *ngIf="multipleMode() && deletable" class="selection">
        <div *ngFor="let item of items"
             [ngClass]="{'multiple': true, 'selected': highlightedItem === item}"
             (click)="highlight(item)">
          <span class="delete" (click)="onDeleteClick($event, item)">X</span>
          <span [innerHtml]="itemRenderer | template:item"></span>
        </div>
      </div>
      <span *ngIf="showArrow" [ngClass]="{'arrow': true, 'up-arrow': arrowDirection}" class="arrow"></span>
    </div>
  `,
  styles: [`
    .selection .multiple {
      display: inline-block;
    }

    .selection .multiple .delete {
      cursor: pointer;
    }

    .ngs-selection {
      position: relative;
    }

    .ngs-selection span.arrow {
      display: inline-block;
      position: absolute;
      right: 10px;
      top: calc(50% - 8px / 2);
      border: 8px solid gray;
      border-bottom-width: 0;
      border-left-color: transparent;
      border-right-color: transparent;
    }

    .ngs-selection span.arrow.up-arrow {
      border: 8px solid gray;
      border-top-width: 0;
      border-left-color: transparent;
      border-right-color: transparent;
    }

    .selected {
      background-color: blueviolet;
    }
  `]
})
export class SelectionComponent {
  @Input() items: Item[];
  @Input() highlightedItem: Item;
  @Input() itemRenderer: Template<(item: Item) => string>;
  @Input() emptyRenderer: () => string;
  @Input() selectionMode: string;
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
