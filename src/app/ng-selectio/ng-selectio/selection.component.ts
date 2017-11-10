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
        <div [innerHtml]="bypassSecurityTrustHtml ? ((itemRenderer(items[0])) | safeHtml) : (itemRenderer(items[0]))">
        </div>
      </div>
      <div *ngIf="multipleMode()" class="selection">
        <div *ngFor="let item of items" [innerHtml]="bypassSecurityTrustHtml ? ((itemRenderer(item)) | safeHtml) : (itemRenderer(item))">
        </div>
      </div>
      <span class="arrow"></span>
    </div>
  `,
  styles: [`
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
    .selection .test-class {
      display: inline-block !important;
    }
  `]
})
export class SelectionComponent {

  @Input() items: any[];
  @Input() bypassSecurityTrustHtml: boolean = false;
  @Input() itemRenderer = (item: any) => {return JSON.stringify(item);};
  @Input() selectionMode = SELECTION_MODE_SINGLE;

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
}
