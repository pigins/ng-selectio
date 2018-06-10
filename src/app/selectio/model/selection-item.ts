import {Item} from './item';

export class SelectionItem {
  private readonly _item: Item;
  private _highlighted: boolean;

  constructor(item: Item, highlighted: boolean) {
    this._item = item;
    this._highlighted = highlighted;
  }

  get item(): Item {
    return this._item;
  }

  get highlighted(): boolean {
    return this._highlighted;
  }

  highlight() {
    this._highlighted = true;
  }

  unhighlight() {
    this._highlighted = false;
  }
}
