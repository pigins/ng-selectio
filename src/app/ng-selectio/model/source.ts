import {Item} from './item';
import {SourceItem} from './source-item';

/**
 * Source of data from witch selection done.
 * recursive and list data structures.
 */
export interface Source extends Iterable<SourceItem> {
  equals: ((item1: Item, item2: Item) => boolean);
  size(): number;
  appendItem(item: Item);
  appendItems(items: Item[]);
  getItems(): Item[];
  getEnabledSourceItems(): SourceItem[];
  setSelection(selection: Item[]): void;
  getHighlited(): SourceItem | null;
  setOnItemInit(param: (sourceItem) => void): void;
  setItems(items: Item[]): void;
  highlight(index: number): void;
  highlightUpper(): void;
  highlightBelow(): void;
}
