import {DomSanitizer} from '@angular/platform-browser';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
  constructor(private sanitizer: DomSanitizer) {
  }
}
