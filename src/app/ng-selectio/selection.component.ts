import {
  Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import {SELECTION_MODE_SINGLE} from './ng-selectio.component';
import {SELECTION_MODE_MULTIPLE} from './ng-selectio.component';
import {Item} from './types';
import {SelectionMode} from './types';
import {SourceItem} from './model/source';
import {Selection, SelectionItem} from './model/selection';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

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
      <div *ngIf="selection.size() === 0" class="empty">
        <ng-container *ngTemplateOutlet="emptyTemplate ? emptyTemplate : defaultEmptyTemplate"></ng-container>
      </div>

      <ng-container *ngIf="selection.size() >= 1">
        <div *ngIf="singleMode() && !deletable" class="single">
          <div [ngClass]="{'single': true, 'selected': highlightedItem === selection.get(0)}">
            <ng-container *ngTemplateOutlet="itemTemplate ? itemTemplate : defaultItemTemplate;
            context:{item:selection.get(0)}"></ng-container>
          </div>
        </div>

        <div *ngIf="singleMode() && deletable" class="single deletable">
          <div [ngClass]="{'single': true, 'selected': highlightedItem === selection.get(0)}">
            <ng-container *ngTemplateOutlet="itemTemplate ? itemTemplate : defaultItemTemplate;
            context:{item:selection.get(0)}"></ng-container>
            <span class="clear" (click)="onDeleteClick($event, selection.get(0))">
              <ng-container *ngTemplateOutlet="clearTemplate ? clearTemplate : defaultClearTemplate"></ng-container>
            </span>
          </div>
        </div>

        <div *ngIf="multipleMode() && !deletable" class="multiple">
          <div *ngFor="let item of selection;"
               [ngStyle]="{'display': 'inline-block'}"
               [ngClass]="{'selected': highlightedItem === item}"
               (click)="highlight(item)">
            <ng-container *ngTemplateOutlet="itemTemplate ? itemTemplate : defaultItemTemplate;
            context:{item:item}"></ng-container>
          </div>
        </div>

        <div *ngIf="multipleMode() && deletable" class="multiple deletable">
          <div *ngFor="let item of selection"
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
export class SelectionComponent implements OnChanges, OnInit, OnDestroy {
  @Input() $selections: Observable<SourceItem[]>;
  @Input() highlightedItem: SelectionItem; // should be inside selection
  @Input() selectionMode: SelectionMode;
  @Input() deletable: boolean;
  @Input() showArrow: boolean;
  @Input() arrowDirection: boolean;
  @Input() disabled: boolean;
  @Input() selectionMaxLength: number;
  @Input() selectionDefault: Item | Item[] | null;

  @Input() itemTemplate: TemplateRef<any>;
  @Input() emptyTemplate: TemplateRef<any>;
  @Input() clearTemplate: TemplateRef<any>;

  @Output() onHighlightItem = new EventEmitter<SelectionItem>();
  @Output() onAfterSelectionChanged = new EventEmitter<Selection>();

  selection: Selection = new Selection();
  private selectionChangeSubscription: Subscription;

  cross = '&#10005';

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    this.selectionChangeSubscription = this.$selections.subscribe((sourceItems: SourceItem[]) => {
      if (this.selectionMode === SELECTION_MODE_SINGLE) {
        const dataItem = sourceItems[0].data;
        this.selection.setData([new SelectionItem(dataItem, false)]);
        this.onAfterSelectionChanged.emit(this.selection);
      } else if (this.selectionMode === SELECTION_MODE_MULTIPLE) {
        if (this.selectionMaxLength < 0 || (this.selection.size() + 1 <= this.selectionMaxLength)) {
          const selectionItems = sourceItems.map((sourceItem: SourceItem) => {
            return new SelectionItem(sourceItem.data, false);
          });
          this.selection.pushAll(selectionItems);
          this.onAfterSelectionChanged.emit(this.selection);
        }
      }
    });

    if (this.selectionDefault) {
      if (Array.isArray(this.selectionDefault)) {
        const selectionItems = this.selectionDefault.map((dataItem: Item) => {
          return new SelectionItem(dataItem, false);
        });
        this.selection.setData(selectionItems);
        this.onAfterSelectionChanged.emit(this.selection);
      } else {
        this.selection.setData([new SelectionItem(this.selectionDefault, false)]);
        this.onAfterSelectionChanged.emit(this.selection);
      }
    }
  }

  ngOnDestroy(): void {
    this.selectionChangeSubscription.unsubscribe();
  }

  singleMode() {
    return this.selectionMode === SELECTION_MODE_SINGLE;
  }

  multipleMode() {
    return this.selectionMode === SELECTION_MODE_MULTIPLE;
  }

  onDeleteClick(event: MouseEvent, selectionItem: SelectionItem) {
    if (this.disabled) {
      return;
    }
    event.stopPropagation();
    this.selection.remove(selectionItem);
    this.onAfterSelectionChanged.emit(this.selection);
  }

  highlight(selectionItem: SelectionItem) {
    if (this.disabled) {
      return;
    }
    if (this.highlightedItem !== selectionItem) {
      this.onHighlightItem.emit(selectionItem);
    }
  }
}
