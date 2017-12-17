import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Pipe, PipeTransform} from '@angular/core';
import {Template} from './types';

@Pipe({name: 'template'})
export class TemplatePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {
  }

  transform(value: Template<any> | null | undefined, ...renderContext: any[]): string | SafeHtml | null {
    if (value === null || value === undefined) {
      return null;
    } else if (typeof value === 'string') {
      return value;
    } else if (typeof value === 'function') {
      return TemplatePipe.runFunction(<Function>value, renderContext);
    } else if (typeof value === 'object') {
      if (value.bypassSecurityTrustHtml) {
        let res = TemplatePipe.runFunction(<Function>value.template, renderContext);
        if (res === null) {
          return null;
        } else {
          return this.sanitizer.bypassSecurityTrustHtml(res);
        }
      } else {
        return TemplatePipe.runFunction(<Function>value.template, renderContext);
      }
    }
    return null;
  }

  static runFunction(fnc: Function, renderContext: any[]): string | null {
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
    return null;
  }
}
