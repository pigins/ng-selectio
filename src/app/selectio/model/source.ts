import {Item} from './item';
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
  updateSelection(selection: Item[]): void;
  isHighlited(sourceItem: SourceItem): boolean;
  setHighlited(sourceItem: SourceItem): void;
  getHighlited(): SourceItem;
  setOnItemInit(param: (sourceItem) => void): void;
}


