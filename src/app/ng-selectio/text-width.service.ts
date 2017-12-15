import {Injectable} from '@angular/core';

@Injectable()
export class TextWidthService {
  context: CanvasRenderingContext2D | null;

  constructor() {
    let canvas = document.createElement('canvas');
    this.context = canvas.getContext('2d');
  }

  public measureText(text: string, element: Element): number {
    if (this.context) {
      this.context.font = getComputedStyle(element).font + '';
      return this.context.measureText(text).width;
    } else {
      return text.length;
    }
  }
}
