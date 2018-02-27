import {SelectioPluginComponent} from '../selectio-plugin.component';

export interface KeyboardStrategy {
  onKeyPress(event: KeyboardEvent, selectio: SelectioPluginComponent): void;
}
