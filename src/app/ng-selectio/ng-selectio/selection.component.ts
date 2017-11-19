import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SELECTION_MODE_SINGLE} from "./ng-selectio.component";
import {SELECTION_MODE_MULTIPLE} from "./ng-selectio.component";

@Component({
  selector: 'selection',
  template: `
    <div [ngClass]="{'ngs-selection': true, 'disabled': disabled}">
      <div *ngIf="this.items.length === 0" class="selection">
        <span *ngIf="emptyRenderer" [innerHtml]="bypassSecurityTrustHtml ? ((emptyRenderer()) | safeHtml) : (emptyRenderer())"></span>
      </div>
      <div *ngIf="singleMode()" class="selection">
        <div
          [ngClass]="{'single': true, 'selected': highlightedItem === items[0]}" 
          [innerHtml]="bypassSecurityTrustHtml ? ((itemRenderer(items[0])) | safeHtml) : (itemRenderer(items[0]))"
          (click)="highlight(items[0])"
        >
        </div>
      </div>
      <div *ngIf="multipleMode() && !deletable" class="selection">
        <div *ngFor="let item of items;"
          [ngClass]="{'multiple': true, 'selected': highlightedItem === item}" 
          [innerHtml]="bypassSecurityTrustHtml ? ((itemRenderer(item)) | safeHtml) : (itemRenderer(item))" 
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
          <span [innerHtml]="bypassSecurityTrustHtml ? ((itemRenderer(item)) | safeHtml) : (itemRenderer(item))"></span>
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

  @Input() items: any[];
  @Input() highlightedItem: any = null;
  @Input() bypassSecurityTrustHtml: boolean = false;
  @Input() itemRenderer: (item: any) => string = (item: any) => {return JSON.stringify(item);};
  @Input() emptyRenderer: () => string = () => {return 'no data'};
  @Input() selectionMode = SELECTION_MODE_SINGLE;
  @Input() deletable = false;
  @Input() showArrow = true;
  @Input() disabled = false;

  @Output() onDeleteItem = new EventEmitter<any>();
  @Output() onHighlightItem = new EventEmitter<any>();

  constructor() {}

  singleMode() {
    return this.selectionMode === SELECTION_MODE_SINGLE;
  }

  multipleMode() {
    return this.selectionMode === SELECTION_MODE_MULTIPLE;
  }

  onDeleteClick(event: MouseEvent, item: any) {
    if (this.disabled) {
      return;
    }
    event.stopPropagation();
    this.onDeleteItem.emit(item);
  }

  highlight(item: any) {
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
