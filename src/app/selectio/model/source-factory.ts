import {ArraySource} from './array-source';
import {Source} from './source';
import {Item} from './item';
import {SourceType} from './source-types';

export class SourceFactory {
  static getInstance(sourceType: SourceType,
                     itemEquals: ((item1: Item, item2: Item) => boolean),
                     items: Item[],
                     onItemInit: (sourceItem) => void): Source {
    if (sourceType === SourceType.ARRAY) {
      return new ArraySource(items, onItemInit, itemEquals);
    } else if (sourceType === SourceType.TREE) {
      throw new Error('not implemented');
    } else {
      throw new Error('source type not exist');
    }
  }
}
