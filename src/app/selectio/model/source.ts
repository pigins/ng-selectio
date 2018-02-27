import {Item} from '../types';
import {SourceType} from '../list.component';

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
}

export class ArraySource implements Source {

  private disabledItemMapper: (item: Item) => boolean = (item: Item) => false;
  private sourceItems: SourceItem[] = [];
  private highlitedItem: SourceItem;

  appendDataItem(item: Item) {
    this.sourceItems = this.sourceItems.concat(new SourceItem(item));
  }

  appendDataItems(items: Item[]) {
    const sourceItems = items.map(item => new SourceItem(item));
    this.sourceItems = this.sourceItems.concat(sourceItems);
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

export class SourceItem {
  private _data: Item;
  private _disabled: boolean;
  private _selected: boolean;

  constructor(data: Item) {
    this._data = data;
    this._disabled = false;
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

  get selected(): boolean {
    return this._selected;
  }

  set selected(value: boolean) {
    this._selected = value;
  }
}

export class SourceFactory {
  static getInstance(sourceType: SourceType, items?: Item[], disabledItemMapper?: (item: Item) => boolean): Source {
    if (items) {
      if (sourceType === SourceType.ARRAY) {
        const result = new ArraySource();
        if (disabledItemMapper) {
          result.setDisabledItemMapper(disabledItemMapper);
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


