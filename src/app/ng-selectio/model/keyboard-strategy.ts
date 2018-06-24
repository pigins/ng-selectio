import {SelectioPluginComponent} from '../selectio.component';
import {ModelService} from './model.service';

export interface KeyboardStrategy {
  onKeyPress(event: KeyboardEvent, selectio: SelectioPluginComponent, model: ModelService): void;
}
