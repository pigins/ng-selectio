import {Pipe, PipeTransform} from '@angular/core';
import {SourceItem} from './model/source-item';

@Pipe({name: 'defaultItem'})
export class DefaultItemPipe implements PipeTransform {
  transform(value: SourceItem, ...args: any[]): any {
    if (typeof value.data === 'string') {
      return value.data;
    } else if (typeof value.data === 'number') {
      return value.data + '';
    } else {
      return JSON.stringify(value.data);
    }
  }
}
