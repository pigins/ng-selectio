import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'ng-selectio-item',
  template: `
    <li #li
        [ngClass]="{'active': isActive, 'selected': isSelected}"
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
  `]
})
export class ItemComponent implements OnInit {

  @Input() data: any;
  @Input() isActive: boolean;
  @Input() isSelected: boolean;
  @Input() renderItem: (item:any) => string;
  @Input() bypassSecurityTrustHtml: boolean = false;

  defaultRenderItem:(item:any) => string = (item) => {
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
    return this.renderItem ? this.renderItem(this.data): this.defaultRenderItem(this.data);
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
