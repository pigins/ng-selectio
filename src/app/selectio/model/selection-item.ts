import {Item} from './item';

export class SelectionItem {
  private _data: Item;
  private _markedForDelete: boolean;
  private itemEquals: (item1: Item, item2: Item) => boolean;

  constructor(data: Item, markedForDelete: boolean, itemEquals: (item1: Item, item2: Item) => boolean) {
    this._data = data;
    this._markedForDelete = markedForDelete;
    this.itemEquals = itemEquals;
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

  public equals(selectionItem: SelectionItem): boolean {
    return (this._markedForDelete === selectionItem._markedForDelete) && this.itemEquals(this._data, selectionItem._data);
  }
}
