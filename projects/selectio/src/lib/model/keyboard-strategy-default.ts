import {KeyboardStrategy} from './keyboard-strategy';
import {SelectioComponent} from '../selectio.component';
import {KEY_CODE} from './key-codes';
import {ModelService} from './model.service';

export class KeyboardStrategyDefault implements KeyboardStrategy {

  onKeyPress(event: KeyboardEvent, selectio: SelectioComponent, model: ModelService): void {
    if (event.keyCode === KEY_CODE.DOWN_ARROW && !selectio.expanded && selectio.hasFocus()) {
      selectio.expand();
    }
    if (event.keyCode === KEY_CODE.ESC && selectio.expanded && selectio.hasFocus()) {
      selectio.collapse();
    }
    if (event.keyCode === KEY_CODE.ENTER && selectio.source.getHighlited() && selectio.expanded) {
      model.selectHighlitedItem();
    }
    if (event.keyCode === KEY_CODE.UP_ARROW && selectio.expanded) {
      model.highlightUpper();
    }
    if (event.keyCode === KEY_CODE.DOWN_ARROW && selectio.expanded) {
      model.highlightBelow();
    }
  }
}
