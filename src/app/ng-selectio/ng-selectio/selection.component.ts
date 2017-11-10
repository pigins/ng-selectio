import {Component, Input} from '@angular/core';
import {SELECTION_MODE_SINGLE} from "./ng-selectio.component";
import {SELECTION_MODE_MULTIPLE} from "./ng-selectio.component";

@Component({
  selector: 'selection',
  template: `
    <div class="ngs-selection">
      <span class="selection" [innerHtml]="bypassSecurityTrustHtml ? ((renderSelection(items)) | safeHtml) : (renderSelection(items))"></span>
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

  constructor() {

  }

  // TODO add cross for delete elem
  renderSelection(): string {
    if (!this.items) {
      return;
    } else if (this.items.length === 0) {
      return `<span>No selection</span>`;
    } else if (this.selectionMode === SELECTION_MODE_SINGLE) {
      if (this.items.length > 1) {
        throw new Error('selection length > 1 for single selection mode');
      }
      return this.itemRenderer(this.items[0]);
    } else if (this.selectionMode === SELECTION_MODE_MULTIPLE) {
      return this.items.map(item => {
        return `<span class="test-class">${this.itemRenderer(item)}</span>`;
      }).join('');
    }
  }
}
