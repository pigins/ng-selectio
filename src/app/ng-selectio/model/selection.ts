import {Item} from './item';
import {SelectionItem} from './selection-item';
import {SelectionMode} from './selection-modes';

export class Selection implements Iterable<SelectionItem> {
  private items: SelectionItem[];
  private selectionMode: SelectionMode;
  private readonly equals: (item1: Item, item2: Item) => boolean;
  private selectionMaxLength: number;

  constructor(selectionMode: SelectionMode, selectionMaxLength: number, equals: (item1: Item, item2: Item) => boolean) {
    this.items = [];
    this.selectionMode = selectionMode;
    this.selectionMaxLength = selectionMaxLength;
    this.equals = equals;
  }

  setSelectionMode(selectionMode: SelectionMode) {
    this.selectionMode = selectionMode;
  }

  setData(items: SelectionItem[]) {
    this.items = items;
  }

  forEach(fn: Function): void {
    this.items.forEach(item => {
      fn(item);
    });
  }

  removeData(item: Item): void {
    for (let i = 0; i < this.items.length; i++) {
      if (this.equals(this.items[i].item, item)) {
        this.items.splice(this.items.indexOf(this.items[i]), 1);
        break;
      }
    }
  }

  contains(item: Item): boolean {
    for (let i = 0; i < this.items.length; i++) {
      if (this.equals(this.items[i].item, item)) {
        return true;
      }
    }
    return false;
  }

  get(index: number) {
    return this.items[index];
  }

  setItems(items: Item[]) {
    this.items = items.map(item => {
      return new SelectionItem(item, false);
    });
  }

  push(item: Item): void {
    this.items.push(new SelectionItem(item, false));
  }

  pushAll(items: SelectionItem[]): void {
    this.items = this.items.concat(items);
  }

  remove(item: SelectionItem): void {
    this.items.splice(this.items.indexOf(item), 1);
  }

  size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items.length = 0;
  }

  getItems(): Item[] {
    return this.items.map(item => item.item);
  }

  toItem(): Item | null {
    return (this.items.length > 0) ? this.items[0].item : null;
  }

  firstItemHighlighted(): boolean {
    return this.items[0].highlighted;
  }

  deleteLastItem(): void {
    this.items.pop();
  }

  setHighlightedItem(value: SelectionItem) {
    this.items.forEach((selectionItem) => {
      if (this.equals(value.item, selectionItem.item)) {
        selectionItem.highlight();
      } else {
        selectionItem.unhighlight();
      }
    });
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
