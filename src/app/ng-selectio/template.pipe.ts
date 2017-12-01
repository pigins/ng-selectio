import {DomSanitizer} from '@angular/platform-browser';
import {Pipe, PipeTransform} from '@angular/core';
import {Template} from './template';

@Pipe({name: 'template'})
export class TemplatePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {
  }

  transform(value: Template<any>, ...renderContext: any[]): any {
    if (value === null || value === undefined) {
      /*NOPE*/
     } else if (typeof value === 'string') {
      return value;
    } else if (typeof value === 'function') {
      return TemplatePipe.runFunction(<Function>value, renderContext);
    } else if (typeof value === 'object') {
      if (value.bypassSecurityTrustHtml) {
        return this.sanitizer.bypassSecurityTrustHtml(TemplatePipe.runFunction(<Function>value.template, renderContext));
      } else {
        return TemplatePipe.runFunction(<Function>value.template, renderContext);
      }
    }
  }

  static runFunction(fnc: Function, renderContext: any[]): string {
    if (renderContext.length === 0) {
      return fnc();
    } else if (renderContext.length === 1) {
      return fnc(renderContext[0]);
    } else if (renderContext.length === 2) {
      return fnc(renderContext[0], renderContext[1]);
    } else if (renderContext.length === 3) {
      return fnc(renderContext[0], renderContext[1], renderContext[2]);
    } else if (renderContext.length === 4) {
      return fnc(renderContext[0], renderContext[1], renderContext[2], renderContext[3]);
    }
  }
}
