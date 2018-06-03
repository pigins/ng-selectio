import {Item} from './item';
import {SelectionItem} from './selection-item';
import {SelectionMode} from './selection-modes';

export class Selection implements Iterable<SelectionItem> {
  private items: SelectionItem[] = [];
  private _highlightedItem: SelectionItem | null;
  private selectionMode: SelectionMode;
  private _equals: (item1: Item, item2: Item) => boolean = (item1: Item, item2: Item) => item1 === item2;

  constructor(items?: Item[]) {
    if (items) {
      items.forEach((item) => {
        this.push(item);
      });
    }
  }

  setSelectionMode(selectionMode: SelectionMode) {
    this.selectionMode = selectionMode;
  }

  public setData(items: SelectionItem[]) {
    this.items = items;
  }

  public forEach(fn: Function): void {
    this.items.forEach(item => {
      fn(item);
    });
  }

  public removeData(data: Item): void {
    for (let i = 0; i < this.items.length; i++) {
      if (this._equals(this.items[i].data, data)) {
        this.items.splice(this.items.indexOf(this.items[i]), 1);
        break;
      }
    }
  }

  public contains(data: Item): boolean {
    for (let i = 0; i < this.items.length; i++) {
      if (this._equals(this.items[i].data, data)) {
        return true;
      }
    }
    return false;
  }

  public get(index: number) {
    return this.items[index];
  }

  setItems(items: Item[]) {
    this.items = items.map(item => {
      return new SelectionItem(item, false, this._equals);
    });
  }

  public push(data: Item): void {
    this.items.push(new SelectionItem(data, false, this._equals));
  }

  public pushAll(items: SelectionItem[]): void {
    this.items = this.items.concat(items);
  }

  public remove(item: SelectionItem): void {
    this.items.splice(this.items.indexOf(item), 1);
  }

  public size(): number {
    return this.items.length;
  }

  public clear(): void {
    this.items.length = 0;
  }

  public getItems(): Item[] {
    return this.items
      .filter(item => !item.markedForDelete)
      .map(item => item.data);
  }

  public toItem(): Item | null {
    return (this.items.length > 0 && !this.items[0].markedForDelete) ? this.items[0].data : null;
  }

  public getFirst() {
    return this.items[0];
  }

  getEquals(): (item1: Item, item2: Item) => boolean {
    return this._equals;
  }

  setEquals(value: (item1: Item, item2: Item) => boolean) {
    this._equals = value;
  }

  firstItemHighlighted(): boolean {
    return this.items[0] === this._highlightedItem;
  }

  itemHighlighted(item: SelectionItem): boolean {
    return this._highlightedItem === item;
  }

  highlightOrDeleteLastItem(): void {
    if (!this._highlightedItem) {
      this.setHighlightedItem(this.items[this.items.length - 1]);
    } else {
      this.items = this.items.filter(item => item !== this._highlightedItem);
      this._highlightedItem = null;
    }
  }

  getHighlightedItem(): SelectionItem | null {
    return this._highlightedItem;
  }

  setHighlightedItem(value: SelectionItem | null) {
    this._highlightedItem = value;
  }

  [Symbol.iterator](): Iterator<SelectionItem> {
    let index = 0;
    return {
      next: () => {
        const value = this.items[index];
        const done = index >= this.items.length;
        index++;
        return {value, done};
      }
    };
  }
}
