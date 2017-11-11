import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SELECTION_MODE_SINGLE} from "./ng-selectio.component";
import {SELECTION_MODE_MULTIPLE} from "./ng-selectio.component";

@Component({
  selector: 'selection',
  template: `
    <div class="ngs-selection">
      <div *ngIf="this.items.length === 0" class="selection">
        <span>No selection</span>
      </div>
      <div *ngIf="singleMode()" class="selection">
        <div class="single" [innerHtml]="bypassSecurityTrustHtml ? ((itemRenderer(items[0])) | safeHtml) : (itemRenderer(items[0]))">
          
        </div>
      </div>
      <div *ngIf="multipleMode() && !deletable" class="selection">
        <div class="multiple" [innerHtml]="bypassSecurityTrustHtml ? ((itemRenderer(item)) | safeHtml) : (itemRenderer(item))"
             *ngFor="let item of items" >
        </div>
      </div>
      <div *ngIf="multipleMode() && deletable" class="selection">
        <div class="multiple" *ngFor="let item of items" >
          <span class="delete" (click)="onDeleteClick($event, item)">X</span>
          <span [innerHtml]="bypassSecurityTrustHtml ? ((itemRenderer(item)) | safeHtml) : (itemRenderer(item))"></span>
        </div>
      </div>
      <span class="arrow"></span>
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
      border: 1px solid red;
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
  `]
})
export class SelectionComponent {

  @Input() items: any[];
  @Input() bypassSecurityTrustHtml: boolean = false;
  @Input() itemRenderer = (item: any) => {return JSON.stringify(item);};
  @Input() selectionMode = SELECTION_MODE_SINGLE;
  @Input() deletable = false;

  @Output()
  onDeleteItem = new EventEmitter<any>();

  constructor() {

  }

  singleMode() {
    return this.selectionMode === SELECTION_MODE_SINGLE;
  }

  multipleMode() {
    return this.selectionMode === SELECTION_MODE_MULTIPLE;
  }

  onDeleteClick(event: MouseEvent, item: any) {
    event.stopPropagation();
    this.onDeleteItem.emit(item);
  }
}
