import {Item} from '../types';

export class ArraySource{

}

export class AsyncSource {

}

export class TreeSource {

}

export interface SourceItem {
  data: Item;
  disabled(): boolean;
  disable(): void;
  enable(): void;
  highlighted(): boolean;
  highlight() : void;
  unhighlight() : void;
}

/**
 * Source of data from witch selection done.
 * Encapsulates remote and local sources.
 * recursive and list data structures.
 */
export interface Source extends Iterable<SourceItem> {
  append(sourceItem: SourceItem);
  appendAll(sourceItems: SourceItem[]);
}
