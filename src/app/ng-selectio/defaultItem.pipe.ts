import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'defaultItem'})
export class DefaultItemPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (typeof value === 'string') {
      return value;
    } else if (typeof value === 'number') {
      return value + '';
    } else {
      return JSON.stringify(value);
    }
  }
}
