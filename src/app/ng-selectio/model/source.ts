import {Item} from '../types';
import {SourceType} from '../list.component';

export class ArraySource implements Source {

  source: SourceItem[] = [];

  constructor() {}

  appendSourceItem(sourceItem: SourceItem) {
  }

  appendSourceItems(sourceItems: SourceItem[]) {

  }

  appendDataItem(item: Item) {

  }

  appendDataItems(items: Item[]) {

  }

  getDataItems(): Item[] {
    throw new Error('not implemented');
  }

  [Symbol.iterator](): Iterator<SourceItem> {
    let index: number = 0;
    return {
      next: () => {
        let value: SourceItem|null = this.source[index];
        let done = index >= this.source.length;
        index++;
        return { value, done };
      },
    };
  }
}

export class SourceItem {
  private _data: Item;
  private _disabled: boolean;
  private _highlited: boolean;


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
  //static getInstance(sourceType: SourceType): Source
  static getInstance(sourceType: SourceType, items?: Item[]): Source {
    if (items) {
      if (sourceType === SourceType.ARRAY) {
        let result = new ArraySource();
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

/**
 * Source of data from witch selection done.
 * recursive and list data structures.
 */
export interface Source extends Iterable<SourceItem> {
  appendSourceItem(sourceItem: SourceItem);
  appendSourceItems(sourceItems: SourceItem[]);
  appendDataItem(item: Item);
  appendDataItems(items: Item[]);
  getDataItems(): Item[];
}
