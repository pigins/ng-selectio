import {Item} from './item';
import {SourceItem} from './source-item';
import {Source} from './source';
import {ArraySourceItem} from './array-source-item';

export class ArraySource implements Source {
  private sourceItems: ArraySourceItem[] = [];
  private highlitedItem: ArraySourceItem;
  private onItemInitCallback: (sourceItem) => void | null;

  setOnItemInit(param: (sourceItem) => void): void {
    this.onItemInitCallback = param;
  }

  appendDataItem(item: Item) {
    this.sourceItems = this.sourceItems.concat(new ArraySourceItem(item));
    if (this.onItemInitCallback) {
      this.onItemInitCallback(item);
    }
  }

  appendDataItems(items: Item[]) {
    const sourceItems = items.map(item => new ArraySourceItem(item));
    this.sourceItems = this.sourceItems.concat(sourceItems);
    if (this.onItemInitCallback) {
      sourceItems.forEach((sourceItem) => {
        this.onItemInitCallback(sourceItem);
      });
    }
  }

  getDataItems(): Item[] {
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
  public updateSelection(selection: Item[]): void {
    for (let i = 0; i < selection.length; i++) {
      for (let j = 0; j < this.sourceItems.length; j++) {
        this.sourceItems[j].selected = selection[i] === this.sourceItems[j].data;
      }
    }
  }

  isHighlited(sourceItem: ArraySourceItem): boolean {
    return sourceItem === this.highlitedItem;
  }

  setHighlited(sourceItem: ArraySourceItem): void {
    this.highlitedItem = sourceItem;
  }

  getHighlited(): SourceItem {
    return this.highlitedItem;
  }

  [Symbol.iterator](): Iterator<ArraySourceItem> {
    let index: number = 0;
    return {
      next: () => {
        index++;
        return {
          value: this.sourceItems[index],
          done: this.sourceItems.length === 0 || index + 1 >= this.sourceItems.length
        };
      },
    };
  }
}
