import {SourceItem} from './source-item';
import {Item} from './item';

export class ArraySourceItem implements SourceItem {
  private readonly _item: Item;
  private _disabled: boolean;
  private _selected: boolean;
  private _highlighted: boolean;

  constructor(item: Item) {
    this._item = item;
    this._disabled = false;
    this._selected = false;
    this._highlighted = false;
  }

  get item(): Item {
    return this._item;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  get selected(): boolean {
    return this._selected;
  }

  get highlighted(): boolean {
    return this._highlighted;
  }

  disable() {
    this._disabled = true;
  }

  enable() {
    this._disabled = false;
  }

  select() {
    this._selected = true;
  }

  deselect() {
    this._selected = false;
  }

  highlight() {
    this._highlighted = true;
  }

  unhighlight() {
    this._highlighted = false;
  }
}
