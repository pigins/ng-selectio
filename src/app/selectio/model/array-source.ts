import {Item} from './item';
import {SourceItem} from './source-item';
import {Source} from './source';
import {ArraySourceItem} from './array-source-item';

export class ArraySource implements Source {
  equals: (item1: Item, item2: Item) => boolean;
  private sourceItems: ArraySourceItem[];
  private previousHighlightedIndex: number;
  private onItemInitCallback: (sourceItem) => void | null;

  constructor(items: Item[], onItemInitCallback: (sourceItem) => void | null, equals: (item1: Item, item2: Item) => boolean) {
    this.equals = equals;
    this.onItemInitCallback = onItemInitCallback;
    this.sourceItems = [];
    this.appendItems(items);
  }

  setOnItemInit(param: (sourceItem) => void): void {
    this.onItemInitCallback = param;
  }

  setItems(items: Item[]): void {
    const sourceItems = items.map(item => new ArraySourceItem(item));
    this.sourceItems = sourceItems;
    if (this.onItemInitCallback) {
      sourceItems.forEach((sourceItem) => {
        this.onItemInitCallback(sourceItem);
      });
    }
  }

  appendItem(item: Item) {
    this.sourceItems = this.sourceItems.concat(new ArraySourceItem(item));
    if (this.onItemInitCallback) {
      this.onItemInitCallback(item);
    }
  }

  appendItems(items: Item[]) {
    const sourceItems = items.map(item => new ArraySourceItem(item));
    this.sourceItems = this.sourceItems.concat(sourceItems);
    if (this.onItemInitCallback) {
      sourceItems.forEach((sourceItem) => {
        this.onItemInitCallback(sourceItem);
      });
    }
  }

  getItems(): Item[] {
    return this.sourceItems.map(sourceItem => {
      return sourceItem.item;
    });
  }

  getEnabledSourceItems(): ArraySourceItem[] {
    return this.sourceItems.filter(sourceItem => sourceItem.disabled);
  }

  size(): number {
    return this.sourceItems.length;
  }

  // TODO rewrite with hash
  setSelection(selection: Item[]): void {
    if (selection.length === 0) {
      for (let j = 0; j < this.sourceItems.length; j++) {
        this.sourceItems[j].deselect();
      }
    }
    for (let i = 0; i < selection.length; i++) {
      for (let j = 0; j < this.sourceItems.length; j++) {
        if (this.equals(selection[i], this.sourceItems[j].item)) {
          this.sourceItems[j].select();
        } else {
          this.sourceItems[j].deselect();
        }
      }
    }
  }

  getHighlited(): SourceItem | null {
    const arr = this.sourceItems.filter((sourceItem) => sourceItem.highlighted);
    if (arr.length > 0) {
      return arr[0];
    } else {
      return null;
    }
  }

  highlight(index: number) {
    if (this.previousHighlightedIndex >= 0) {
      this.sourceItems[this.previousHighlightedIndex].unhighlight();
    }
    this.sourceItems[index].highlight();
    this.previousHighlightedIndex = index;
  }

  highlightUpper(): void {
    if (this.previousHighlightedIndex > 0) {
      this.highlight(this.previousHighlightedIndex - 1);
    }
  }

  highlightBelow(): void {
    if (this.previousHighlightedIndex < this.sourceItems.length - 1) {
      this.highlight(this.previousHighlightedIndex + 1);
    }
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
