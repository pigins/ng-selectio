import {ArraySource} from './array-source';
import {Source} from './source';
import {SourceType} from '../list.component';
import {Item} from './item';

export class SourceFactory {
  static getInstance(sourceType: SourceType, items?: Item[], onItemInit?: (sourceItem) => void): Source {
    if (items) {
      if (sourceType === SourceType.ARRAY) {
        const result = new ArraySource();
        if (onItemInit) {
          result.setOnItemInit(onItemInit);
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
