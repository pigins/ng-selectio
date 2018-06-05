import {Item} from './item';
import {SourceItem} from './source-item';

/**
 * Source of data from witch selection done.
 * recursive and list data structures.
 */
export interface Source extends Iterable<SourceItem> {
  itemEquals: ((item1: Item, item2: Item) => boolean);
  size(): number;
  appendItem(item: Item);
  appendItems(items: Item[]);
  getItems(): Item[];
  getEnabledSourceItems(): SourceItem[];
  setSelection(selection: Item[]): void;
  isHighlited(sourceItem: SourceItem): boolean;
  setHighlited(sourceItem: SourceItem): void;
  getHighlited(): SourceItem;
  setOnItemInit(param: (sourceItem) => void): void;
  setItems(items: Item[]): void;
}
