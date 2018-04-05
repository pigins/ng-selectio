import {SourceItem} from './source-item';
import {Item} from './item';

export class ArraySourceItem implements SourceItem {
  private _data: Item;
  private _disabled: boolean;
  private _selected: boolean;
  private itemEquals: (item1: Item, item2: Item) => boolean;

  constructor(data: Item, itemEquals: (item1: Item, item2: Item) => boolean) {
    this._data = data;
    this._disabled = false;
    this.itemEquals = itemEquals;
  }

  get data(): Item {
    return this._data;
  }

  set data(value: Item) {
    this._data = value;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = value;
  }

  get selected(): boolean {
    return this._selected;
  }

  set selected(value: boolean) {
    this._selected = value;
  }

  equals(other: ArraySourceItem): boolean {
    return this._disabled === other._disabled &&
      this._selected === other._selected &&
      this.itemEquals(this._data, other._data);
  }
}
