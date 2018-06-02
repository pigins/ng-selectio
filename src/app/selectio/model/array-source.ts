import {Item} from './item';
import {SourceItem} from './source-item';
import {Source} from './source';
import {ArraySourceItem} from './array-source-item';

export class ArraySource implements Source {
  itemEquals: (item1: Item, item2: Item) => boolean;
  private sourceItems: ArraySourceItem[] = [];
  private highlitedItem: ArraySourceItem;
  private onItemInitCallback: (sourceItem) => void | null;

  setOnItemInit(param: (sourceItem) => void): void {
    this.onItemInitCallback = param;
  }

  appendItem(item: Item) {
    this.sourceItems = this.sourceItems.concat(new ArraySourceItem(item, this.itemEquals));
    if (this.onItemInitCallback) {
      this.onItemInitCallback(item);
    }
  }

  appendItems(items: Item[]) {
    const sourceItems = items.map(item => new ArraySourceItem(item, this.itemEquals));
    this.sourceItems = this.sourceItems.concat(sourceItems);
    if (this.onItemInitCallback) {
      sourceItems.forEach((sourceItem) => {
        this.onItemInitCallback(sourceItem);
      });
    }
  }

  getItems(): Item[] {
    return this.sourceItems.map(sourceItem => {
      return sourceItem.data;
    });
  }

  getEnabledSourceItems(): ArraySourceItem[] {
    return this.sourceItems.filter(sourceItem => sourceItem.disabled);
  }

  public size(): number {
    return this.sourceItems.length;
  }

  // TODO rewrite with hash
  public setSelection(selection: Item[]): void {
    if (selection.length === 0) {
      for (let j = 0; j < this.sourceItems.length; j++) {
        this.sourceItems[j].selected = false;
      }
    }
    for (let i = 0; i < selection.length; i++) {
      for (let j = 0; j < this.sourceItems.length; j++) {
        this.sourceItems[j].selected = (selection[i] === this.sourceItems[j].data);
      }
    }
  }

  isHighlited(sourceItem: ArraySourceItem): boolean {
    return sourceItem === this.highlitedItem;
  }

  setHighlited(sourceItem: ArraySourceItem): void {
    this.highlitedItem = sourceItem;
  }

  setItemEquals(itemEquals: (item1: Item, item2: Item) => boolean) {
    this.itemEquals = itemEquals;
  }

  getHighlited(): SourceItem {
    return this.highlitedItem;
  }

  [Symbol.iterator](): Iterator<ArraySourceItem> {
    let index: number = 0;
    return {
      next: () => {
        return {
          value: this.sourceItems[index++],
          done: this.sourceItems.length === 0 || index > this.sourceItems.length
        };
      },
    };
  }
}
