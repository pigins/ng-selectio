import {Component, EventEmitter, Input, Output, TemplateRef, ViewEncapsulation} from '@angular/core';
import {SELECTION_MODE_SINGLE} from './ng-selectio.component';
import {SELECTION_MODE_MULTIPLE} from './ng-selectio.component';
import {Item} from './types';
import {SelectionMode} from './types';

@Component({
  selector: 'selection',
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-template #defaultItemTemplate let-item="item">
      <span>{{item | defaultItem}}</span>
    </ng-template>
    <ng-template #defaultEmptyTemplate>
      <span>No data</span>
    </ng-template>
    <ng-template #defaultClearTemplate>
      <span [innerHtml]="cross"></span>
    </ng-template>
    
    <div [ngStyle]="{'position': 'relative'}" [ngClass]="{'selection': true}">
      
      <div *ngIf="this.items.length === 0" class="empty">
        <ng-container *ngTemplateOutlet="emptyTemplate ? emptyTemplate : defaultEmptyTemplate"></ng-container>
      </div>
      
      <ng-container *ngIf="items.length >= 1">
        <div *ngIf="singleMode() && !deletable" class="single">
          <div [ngClass]="{'single': true, 'selected': highlightedItem === items[0]}">
            <ng-container *ngTemplateOutlet="itemTemplate ? itemTemplate : defaultItemTemplate;
            context:{item:items[0]}"></ng-container>
          </div>
        </div>

        <div *ngIf="singleMode() && deletable" class="single deletable">
          <div [ngClass]="{'single': true, 'selected': highlightedItem === items[0]}">
            <ng-container *ngTemplateOutlet="itemTemplate ? itemTemplate : defaultItemTemplate;
            context:{item:items[0]}"></ng-container>
            <span class="clear" (click)="onDeleteClick($event, items[0])">
              <ng-container *ngTemplateOutlet="clearTemplate ? clearTemplate : defaultClearTemplate"></ng-container>
            </span>
          </div>
        </div>

        <div *ngIf="multipleMode() && !deletable" class="multiple">
          <div *ngFor="let item of items;"
               [ngStyle]="{'display': 'inline-block'}"
               [ngClass]="{'selected': highlightedItem === item}"
               (click)="highlight(item)">
            <ng-container *ngTemplateOutlet="itemTemplate ? itemTemplate : defaultItemTemplate;
            context:{item:item}"></ng-container>
          </div>
        </div>

        <div *ngIf="multipleMode() && deletable" class="multiple deletable">
          <div *ngFor="let item of items"
               [ngStyle]="{'display': 'inline-block'}"
               [ngClass]="{'selected': highlightedItem === item}"
               (click)="highlight(item)">
            <span class="clear" (click)="onDeleteClick($event, item)">
              <ng-container *ngTemplateOutlet="clearTemplate ? clearTemplate : defaultClearTemplate"></ng-container>
            </span>
            <span>
              <ng-container *ngTemplateOutlet="itemTemplate ? itemTemplate : defaultItemTemplate;
              context:{item:item}"></ng-container>
            </span>
          </div>
        </div>
      </ng-container>
      
      <span *ngIf="showArrow" [ngClass]="{'arrow': true, 'up-arrow': arrowDirection}"></span>
      
    </div>
  `
})
export class SelectionComponent {
  @Input() items: Item[];
  @Input() highlightedItem: Item;
  @Input() selectionMode: SelectionMode;
  @Input() deletable: boolean;
  @Input() showArrow: boolean;
  @Input() arrowDirection: boolean;
  @Input() disabled: boolean;

  @Input() itemTemplate: TemplateRef<any>;
  @Input() emptyTemplate: TemplateRef<any>;
  @Input() clearTemplate: TemplateRef<any>;

  @Output() onDeleteItem = new EventEmitter<Item>();
  @Output() onHighlightItem = new EventEmitter<Item>();

  cross = '&#10005';

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
