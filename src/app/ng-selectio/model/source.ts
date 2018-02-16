import {Item} from '../types';
import {SourceType} from '../list.component';

/**
 * Source of data from witch selection done.
 * recursive and list data structures.
 */
export interface Source extends Iterable<SourceItem> {
  size(): number;
  appendSourceItem(sourceItem: SourceItem);
  appendSourceItems(sourceItems: SourceItem[]);
  appendDataItem(item: Item);
  appendDataItems(items: Item[]);
  getDataItems(): Item[];
}

export class ArraySource implements Source {
  private source: SourceItem[] = [];

  appendSourceItem(sourceItem: SourceItem) {
    throw new Error('not implemented');
  }

  appendSourceItems(sourceItems: SourceItem[]) {
    throw new Error('not implemented');
  }

  appendDataItem(item: Item) {
    this.source = this.source.concat(new SourceItem(item));
  }

  appendDataItems(items: Item[]) {
    const sourceItems = items.map(item => new SourceItem(item));
    this.source = this.source.concat(sourceItems);
  }

  getDataItems(): Item[] {
    return this.source.map(sourceItem => {
      return sourceItem.data;
    });
  }

  public size(): number {
    return this.source.length;
  }

  [Symbol.iterator](): Iterator<SourceItem> {
    let index: number = 0;
    return {
      next: () => {
        index++;
        return {
          value: this.source[index],
          done: this.source.length === 0 || index + 1 >= this.source.length
        };
      },
    };
  }
}

export class SourceItem {
  private _data: Item;
  private _disabled: boolean;
  private _highlited: boolean;

  constructor(data: Item) {
    this._data = data;
    this._disabled = false;
    this._highlited = false;
  }

  get data(): Item {
    return this._data;
  }

  set data(value: Item) {
    this._data = value;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = value;
  }

  get highlited(): boolean {
    return this._highlited;
  }

  set highlited(value: boolean) {
    this._highlited = value;
  }
}

export class SourceFactory {
  static getInstance(sourceType: SourceType, items?: Item[]): Source {
    if (items) {
      if (sourceType === SourceType.ARRAY) {
        const result = new ArraySource();
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


