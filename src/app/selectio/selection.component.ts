import {
  Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import {SELECTION_MODE_SINGLE} from './selectio.component';
import {SELECTION_MODE_MULTIPLE} from './selectio.component';
import {Item} from './model/item';
import {SourceItem} from './model/source-item';
import {Selection} from './model/selection';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {SelectionItem} from './model/selection-item';
import {ModelService} from './model.service';

@Component({
  selector: 'selectio-selection',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [ngStyle]="{'position': 'relative'}" [ngClass]="{'selection': true}">
      <div *ngIf="selection.size() === 0" class="empty">
        <ng-container *ngTemplateOutlet="emptyTemplate"></ng-container>
      </div>

      <ng-container *ngIf="selection.size() >= 1">
        <div *ngIf="singleMode() && !deletable" class="single">
          <div [ngClass]="{'single': true, 'selected': selection.firstItemHighlighted()}">
            <ng-container *ngTemplateOutlet="itemTemplate;
            context:{selectionItem:selection.get(0)}"></ng-container>
          </div>
        </div>

        <div *ngIf="singleMode() && deletable" class="single deletable">
          <div [ngClass]="{'single': true, 'selected': selection.firstItemHighlighted()}">
            <ng-container *ngTemplateOutlet="itemTemplate;
            context:{selectionItem:selection.get(0)}"></ng-container>
            <span class="clear" (click)="onDeleteClick($event, selection.get(0))">
              <ng-container *ngTemplateOutlet="clearTemplate"></ng-container>
            </span>
          </div>
        </div>

        <div *ngIf="multipleMode() && !deletable" class="multiple">
          <div *ngFor="let selectionItem of selection;"
               [ngStyle]="{'display': 'inline-block'}"
               [ngClass]="{'selected': selection.itemHighlighted(selectionItem)}"
               (click)="highlight(selectionItem)">
            <ng-container *ngTemplateOutlet="itemTemplate;
            context:{selectionItem:selectionItem}"></ng-container>
          </div>
        </div>

        <div *ngIf="multipleMode() && deletable" class="multiple deletable">
          <div *ngFor="let selectionItem of selection"
               [ngStyle]="{'display': 'inline-block'}"
               [ngClass]="{'selected': selection.itemHighlighted(selectionItem)}"
               (click)="highlight(selectionItem)">
            <span class="clear" (click)="onDeleteClick($event, selectionItem)">
              <ng-container *ngTemplateOutlet="clearTemplate"></ng-container>
            </span>
            <span>
              <ng-container *ngTemplateOutlet="itemTemplate;
              context:{selectionItem:selectionItem}"></ng-container>
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
  @Input() $ngModelSelection: Observable<Selection>;
  @Input() selectionMode: string;
  @Input() deletable: boolean;
  @Input() showArrow: boolean;
  @Input() arrowDirection: boolean;
  @Input() disabled: boolean;
  @Input() selectionMaxLength: number;
  @Input() selectionDefault: Item | Item[] | null;

  @Input() itemTemplate: TemplateRef<any>;
  @Input() emptyTemplate: TemplateRef<any>;
  @Input() clearTemplate: TemplateRef<any>;

  selection: Selection = new Selection();
  private selectionChangeSubscription: Subscription;

  constructor(private model: ModelService) {

  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    // show selection
    this.model.$selectionsObservable.subscribe((selection) => {
      this.selection = selection;
    });

    this.selectionChangeSubscription = this.$selections.subscribe((sourceItems: SourceItem[]) => {
      if (this.selectionMode === SELECTION_MODE_SINGLE) {
        const dataItem = sourceItems[0].data;
        this.model.pushSelectionItems([new SelectionItem(dataItem, false)]);
      } else if (this.selectionMode === SELECTION_MODE_MULTIPLE) {
        if (this.selectionMaxLength < 0 || (this.selection.size() + 1 <= this.selectionMaxLength)) {
          const selectionItems = sourceItems.map((sourceItem: SourceItem) => {
            return new SelectionItem(sourceItem.data, false);
          });
          this.model.pushSelectionItems(selectionItems);
        }
      }
    });

    if (this.selectionDefault) {
      if (Array.isArray(this.selectionDefault)) {
        const selectionItems = this.selectionDefault.map((dataItem: Item) => {
          return new SelectionItem(dataItem, false);
        });
        this.model.pushSelectionItems(selectionItems);
      } else {
        const items = [new SelectionItem(this.selectionDefault, false)];
        this.model.pushSelectionItems(items);
      }
    }

    this.$ngModelSelection.subscribe((selection: Selection) => {
      this.model.setSelection(selection);
    });
  }

  ngOnDestroy(): void {
    this.selectionChangeSubscription.unsubscribe();
  }

  onDeleteClick(event: MouseEvent, selectionItem: SelectionItem) {
    if (this.disabled) {
      return;
    }
    event.stopPropagation();
    this.model.removeSelectionItem(selectionItem);
  }

  highlight(selectionItem: SelectionItem) {
    if (this.disabled) {
      return;
    }
    this.model.highlightSelectionItem(selectionItem);
  }

  singleMode() {
    return this.selectionMode === SELECTION_MODE_SINGLE;
  }

  multipleMode() {
    return this.selectionMode === SELECTION_MODE_MULTIPLE;
  }
}
