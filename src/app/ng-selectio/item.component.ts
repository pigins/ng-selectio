import {AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Template} from "./template";
import {Item} from "./item";

@Component({
  selector: 'ng-selectio-item',
  template: `
    <li #li
        [ngClass]="{'active': isActive, 'selected': isSelected, 'disabled': disabled}"
        [innerHtml]="itemRenderer | template:data:disabled"
    >
    </li>
  `,
  styles: [`
    .active {
      background-color: bisque;
    }
    .selected {
      background-color: grey;
    }
    .disabled {
      color: gray;
    }
  `]
})
export class ItemComponent implements OnInit, AfterViewChecked {

  @Input() data: Item;
  @Input() isActive: boolean;
  @Input() isSelected: boolean;
  @Input() disabled: boolean;
  @Input() itemRenderer: Template<(countryItem: Item, disabled: boolean) => string>;

  @ViewChild('li') li: ElementRef;
  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
  }

  public getHeight(): number {
    return this.li.nativeElement.offsetHeight;
  }

  public getBottomPosition(): number {
    return this.getTopPosition() + this.getHeight();
  }

  public getTopPosition(): number {
    return this.li.nativeElement.offsetTop;
  }
}
