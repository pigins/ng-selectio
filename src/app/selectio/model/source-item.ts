import {Item} from '../types';

export class SourceItem {
  private _data: Item;
  private _disabled: boolean;
  private _selected: boolean;

  constructor(data: Item) {
    this._data = data;
    this._disabled = false;
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
}
