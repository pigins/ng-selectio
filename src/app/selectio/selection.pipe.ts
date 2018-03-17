import {Pipe, PipeTransform} from '@angular/core';

import {Selection} from './model/selection';
import {Item} from './model/item';
import {TreeSource} from './model/tree-source';
import {Source} from './model/source';

@Pipe({
  name: 'selectionPipe',
  pure: false
})
export class SelectionPipe implements PipeTransform {
  transform(source: Source, selection: Selection): Source {
    if (selection) {
      source.updateSelection(selection.toDataArray());
    }
    return source;
  }
}
