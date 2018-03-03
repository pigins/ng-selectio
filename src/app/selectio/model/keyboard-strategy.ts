import {SelectioPluginComponent} from '../selectio.component';

export interface KeyboardStrategy {
  onKeyPress(event: KeyboardEvent, selectio: SelectioPluginComponent): void;
}
