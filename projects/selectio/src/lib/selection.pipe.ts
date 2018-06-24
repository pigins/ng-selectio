import {Pipe, PipeTransform} from '@angular/core';
import {Selection} from './model/selection';
import {Source} from './model/source';

@Pipe({
  name: 'selectionPipe',
  pure: false
})
export class SelectionPipe implements PipeTransform {
  transform(source: Source, selection: Selection): Source {
    if (selection) {
      source.setSelection(selection.getItems());
    }
    return source;
  }
}
