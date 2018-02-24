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

export class Selection implements Iterable<SelectionItem> {
  private items: SelectionItem[] = [];
  private _equals: (item1: Item, item2: Item) => boolean = (item1: Item, item2: Item) => item1 === item2;

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

  public remove(item: SelectionItem): void {
    this.items.splice(this.items.indexOf(item), 1);
  }

  public push(data: any): void {
    this.items.push(new SelectionItem(data, false));
  }

  public pushAll(items: SelectionItem[]): void {
    this.items = this.items.concat(items);
  }

  public size(): number {
    return this.items.length;
  }

  public clear(): void {
    this.items.length = 0;
  }

  public toDataArray(): Item[] {
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

  [Symbol.iterator](): Iterator<SelectionItem> {
    let index = 0;
    return {
      next: () => {
        const value = this.items[index];
        const done = index >= this.items.length;
        index++;
        return { value, done };
      }
    };
  }
}
