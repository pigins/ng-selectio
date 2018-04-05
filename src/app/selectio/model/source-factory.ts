import {ArraySource} from './array-source';
import {Source} from './source';
import {SourceType} from '../list.component';
import {Item} from './item';

export class SourceFactory {
  static getInstance(sourceType: SourceType,
                     itemEquals: ((item1: Item, item2: Item) => boolean),
                     items?: Item[],
                     onItemInit?: (sourceItem) => void): Source {
    if (sourceType === SourceType.ARRAY) {
      const result = new ArraySource();
      result.setItemEquals(itemEquals);
      if (onItemInit) {
        result.setOnItemInit(onItemInit);
      }
      if (items) {
        result.appendDataItems(items);
      }
      return result;
    } else if (sourceType === SourceType.TREE) {
      throw new Error('not implemented');
    } else {
      throw new Error('source type not exist');
    }
  }
}
