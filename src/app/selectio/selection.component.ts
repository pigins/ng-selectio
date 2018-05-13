import {
  Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef
} from '@angular/core';
import {SELECTION_MODE_SINGLE} from './selectio.component';
import {SELECTION_MODE_MULTIPLE} from './selectio.component';
import {Selection} from './model/selection';
import {Subscription} from 'rxjs/Subscription';
import {SelectionItem} from './model/selection-item';
import {ModelService} from './model.service';

@Component({
  selector: 'selectio-selection',
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
  @Input() selectionMode: string;
  @Input() deletable: boolean;
  @Input() showArrow: boolean;
  @Input() arrowDirection: boolean;
  @Input() disabled: boolean;
  @Input() selectionMaxLength: number;

  @Input() itemTemplate: TemplateRef<any>;
  @Input() emptyTemplate: TemplateRef<any>;
  @Input() clearTemplate: TemplateRef<any>;

  @Output() init = new EventEmitter();

  selection: Selection = new Selection();
  private selectionChangeSubscription: Subscription;

  constructor(private model: ModelService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    this.selectionChangeSubscription = this.model.$selectionsObservable.subscribe(selection => this.selection = selection);
    this.init.emit();
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
