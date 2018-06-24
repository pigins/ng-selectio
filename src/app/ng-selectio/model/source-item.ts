import {Item} from './item';

export interface SourceItem {
  readonly item: Item;
  disabled: boolean;
  selected: boolean;
  highlighted: boolean;
  disable(): void;
  enable(): void;
  select(): void;
  deselect(): void;
  highlight(): void;
  unhighlight(): void;
}
