import {Item} from '../types';
import {SourceType} from '../list.component';
import {SourceItem} from './source-item';

/**
 * Source of data from witch selection done.
 * recursive and list data structures.
 */
export interface Source extends Iterable<SourceItem> {
  size(): number;
  appendDataItem(item: Item);
  appendDataItems(items: Item[]);
  getDataItems(): Item[];
  getEnabledSourceItems(): SourceItem[];
  setDisabledItemMapper(mapper: (item: Item) => boolean): void;
  updateSelection(selection: Item[]): void;
  isHighlited(sourceItem: SourceItem): boolean;
  setHighlited(sourceItem: SourceItem): void;
  getHighlited(): SourceItem;
  setOnItemInit(param: (sourceItem) => void): void;
}

export class ArraySource implements Source {

  private disabledItemMapper: (item: Item) => boolean = (item: Item) => false;
  private sourceItems: SourceItem[] = [];
  private highlitedItem: SourceItem;
  private onItemInitCallback: (sourceItem) => void | null;

  setOnItemInit(param: (sourceItem) => void): void {
    this.onItemInitCallback = param;
  }

  appendDataItem(item: Item) {
    this.sourceItems = this.sourceItems.concat(new SourceItem(item));
    if (this.onItemInitCallback) {
      this.onItemInitCallback(item);
    }
  }

  appendDataItems(items: Item[]) {
    const sourceItems = items.map(item => new SourceItem(item));
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

  getEnabledSourceItems(): SourceItem[] {
    return this.sourceItems.filter(sourceItem => sourceItem.disabled);
  }

  public size(): number {
    return this.sourceItems.length;
  }

  public setDisabledItemMapper(mapper: (item: Item) => boolean): void {
    this.disabledItemMapper = mapper;
    this.sourceItems.forEach((sourceItem: SourceItem) => {
      sourceItem.disabled = this.disabledItemMapper(sourceItem.data);
    });
  }

  // TODO rewrite with hash
  public updateSelection(selection: Item[]): void {
    for (let i = 0; i < selection.length; i++) {
      for (let j = 0; j < this.sourceItems.length; j++) {
        this.sourceItems[j].selected = selection[i] === this.sourceItems[j].data;
      }
    }
  }

  isHighlited(sourceItem: SourceItem): boolean {
    return sourceItem === this.highlitedItem;
  }

  setHighlited(sourceItem: SourceItem): void {
    this.highlitedItem = sourceItem;
  }

  getHighlited(): SourceItem {
    return this.highlitedItem;
  }

  [Symbol.iterator](): Iterator<SourceItem> {
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

export class SourceFactory {
  static getInstance(sourceType: SourceType, items?: Item[], onItemInit?: (sourceItem) => void): Source {
    if (items) {
      if (sourceType === SourceType.ARRAY) {
        const result = new ArraySource();
        if (onItemInit) {
          result.setOnItemInit(onItemInit);
        }
        result.appendDataItems(items);
        return result;
      } else if (sourceType === SourceType.TREE) {
        throw new Error('not implemented');
      } else {
        throw new Error('source type not exist');
      }
    } else {
      if (sourceType === SourceType.ARRAY) {
        return new ArraySource();
      } else if (sourceType === SourceType.TREE) {
        throw new Error('not implemented');
      } else {
        throw new Error('source type not exist');
      }
    }

  }
}


