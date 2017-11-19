import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'ng-selectio-item',
  template: `
    <li #li
        [ngClass]="{'active': isActive, 'selected': isSelected, 'disabled': disabled}"
        [innerHtml]="bypassSecurityTrustHtml ? (_renderItem() | safeHtml) : (_renderItem())"
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
export class ItemComponent implements OnInit {

  @Input() data: any;
  @Input() isActive: boolean;
  @Input() isSelected: boolean;
  @Input() disabled: boolean;
  @Input() itemRenderer: (item:any, disabled: boolean) => string;
  @Input() bypassSecurityTrustHtml: boolean = false;



  defaultItemRenderer:(item:any, disabled: boolean) => string = (item) => {
    if (typeof item === "string") {
      return item;
    } else if (typeof item === "number") {
      return item + '';
    } else {
      return JSON.stringify(item);
    }
  };

  @ViewChild('li') li: ElementRef;
  constructor() {
  }

  ngOnInit() {
  }

  private _renderItem():string {
    return this.itemRenderer ? this.itemRenderer(this.data, this.disabled): this.defaultItemRenderer(this.data, this.disabled);
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
