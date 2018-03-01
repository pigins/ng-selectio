import {Item} from '../types';

export class SelectionItem {
  private _data: Item;
  private _markedForDelete: boolean;

  constructor(data: Item, markedForDelete: boolean) {
    this._data = data;
    this._markedForDelete = markedForDelete;
  }

  get data(): Item {
    return this._data;
  }

  set data(value: Item) {
    this._data = value;
  }

  get markedForDelete(): boolean {
    return this._markedForDelete;
  }

  set markedForDelete(value: boolean) {
    this._markedForDelete = value;
  }
}
