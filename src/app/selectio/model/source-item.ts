import {Item} from './item';

export interface SourceItem {
  data: Item;
  disabled: boolean;
  selected: boolean;
  equals(other: SourceItem): boolean;
}
