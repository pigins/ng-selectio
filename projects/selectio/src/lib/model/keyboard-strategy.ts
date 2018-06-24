import {SelectioComponent} from '../selectio.component';
import {ModelService} from './model.service';

export interface KeyboardStrategy {
  onKeyPress(event: KeyboardEvent, selectio: SelectioComponent, model: ModelService): void;
}
