import {Pipe, PipeTransform} from '@angular/core';
import {Item} from './model/item';

@Pipe({name: 'defaultItem'})
export class DefaultItemPipe implements PipeTransform {
  transform(value: Item, ...args: any[]): any {
    if (typeof value === 'string') {
      return value;
    } else if (typeof value === 'number') {
      return value + '';
    } else {
      return JSON.stringify(value);
    }
  }
}
