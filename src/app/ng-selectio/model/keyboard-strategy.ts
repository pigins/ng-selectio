import {NgSelectioComponent} from '../ng-selectio.component';

export interface KeyboardStrategy {
  onKeyPress(event: KeyboardEvent, selectio: NgSelectioComponent): void;
}
