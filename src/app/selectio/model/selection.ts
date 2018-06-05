import {Item} from './item';
import {SelectionItem} from './selection-item';
import {SelectionMode} from './selection-modes';

export class Selection implements Iterable<SelectionItem> {
  private items: SelectionItem[];
  private highlightedItem: SelectionItem | null;
  private selectionMode: SelectionMode;
  private equals: (item1: Item, item2: Item) => boolean;
  private selectionMaxLength: number;

  constructor(selectionMode: SelectionMode, selectionMaxLength: number, equals: (item1: Item, item2: Item) => boolean) {
    this.items = [];
    this.highlightedItem = null;
    this.selectionMode = selectionMode;
    this.selectionMaxLength = selectionMaxLength;
    this.equals = equals;
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
      if (this.equals(this.items[i].data, data)) {
        this.items.splice(this.items.indexOf(this.items[i]), 1);
        break;
      }
    }
  }

  public contains(data: Item): boolean {
    for (let i = 0; i < this.items.length; i++) {
      if (this.equals(this.items[i].data, data)) {
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
      return new SelectionItem(item, false);
    });
  }

  public push(data: Item): void {
    this.items.push(new SelectionItem(data, false));
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
    return this.equals;
  }

  setEquals(value: (item1: Item, item2: Item) => boolean) {
    this.equals = value;
  }

  firstItemHighlighted(): boolean {
    return this.items[0] === this.highlightedItem;
  }

  itemHighlighted(item: SelectionItem): boolean {
    return this.highlightedItem === item;
  }

  highlightOrDeleteLastItem(): void {
    if (!this.highlightedItem) {
      this.setHighlightedItem(this.items[this.items.length - 1]);
    } else {
      this.items = this.items.filter(item => item !== this.highlightedItem);
      this.highlightedItem = null;
    }
  }

  getHighlightedItem(): SelectionItem | null {
    return this.highlightedItem;
  }

  setHighlightedItem(value: SelectionItem | null) {
    this.highlightedItem = value;
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

  updateItems(items: Item[]) {
    if (this.selectionMode === SelectionMode.SINGLE) {
      this.setItems(items);
    } else {
      if (this.selectionMaxLength < 0 || (this.size() + 1 <= this.selectionMaxLength)) {
        this.pushItems(items);
      }
    }
  }

  setSelectionMaxLength(selectionMaxLength: number) {
    this.selectionMaxLength = selectionMaxLength;
  }

  private pushItems(items: Item[]) {
    this.items = this.items.concat(items.map(item => new SelectionItem(item, false)));
  }
}
