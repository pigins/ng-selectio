import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SELECTION_MODE_SINGLE} from "./ng-selectio.component";
import {SELECTION_MODE_MULTIPLE} from "./ng-selectio.component";
import {Template} from "./template";
import {Item} from "./item";

@Component({
  selector: 'selection',
  template: `
    <div [ngClass]="{'ngs-selection': true, 'disabled': disabled}">
      <div *ngIf="this.items.length === 0" class="selection">
        <span [innerHtml]="emptyRenderer | template"></span>
      </div>
      <div *ngIf="singleMode()" class="selection">
        <div
          [ngClass]="{'single': true, 'selected': highlightedItem === items[0]}" 
          [innerHtml]="itemRenderer | template:items[0]"
          (click)="highlight(items[0])"
        >
        </div>
      </div>
      <div *ngIf="multipleMode() && !deletable" class="selection">
        <div *ngFor="let item of items;"
          [ngClass]="{'multiple': true, 'selected': highlightedItem === item}"
          [innerHtml]="itemRenderer | template:item" 
          (click)="highlight(item)"
        >
        </div>
      </div>
      <div *ngIf="multipleMode() && deletable" class="selection">
        <div *ngFor="let item of items" 
          [ngClass]="{'multiple': true, 'selected': highlightedItem === item}"
          (click)="highlight(item)"
        >
          <span class="delete" (click)="onDeleteClick($event, item)">X</span>
          <span [innerHtml]="itemRenderer | template:item"></span>
        </div>
      </div>
      <span *ngIf="showArrow" class="arrow"></span>
    </div>
  `,
  styles: [`
    .selection .multiple {
      display: inline-block;
    }
    .selection .multiple .delete{
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
      border-right-color: transparent
    }
    .ngs-expanded .ngs-selection span.arrow {
      border: 8px solid gray;
      border-top-width: 0;
      border-left-color: transparent;
      border-right-color: transparent
    }
    
    .selected {
      background-color: blueviolet;
    }
    
  `]
})
export class SelectionComponent implements OnInit{
  ngOnInit(): void {
  }

  @Input() items: Item[];
  @Input() highlightedItem: Item;
  @Input() itemRenderer: Template<(item: Item) => string>;
  @Input() emptyRenderer: () => string;
  @Input() selectionMode;
  @Input() deletable;
  @Input() showArrow;
  @Input() disabled;

  @Output() onDeleteItem = new EventEmitter<Item>();
  @Output() onHighlightItem = new EventEmitter<Item>();

  constructor() {}

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
    if (this.highlightedItem === item) {
      this.onHighlightItem.emit(null);
    } else {
      this.onHighlightItem.emit(item);
    }
  }
}
