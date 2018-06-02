import {KeyboardStrategy} from './keyboard-strategy';
import {SelectioPluginComponent} from '../selectio.component';
import {KEY_CODE} from './key-codes';
import {ModelService} from './model.service';

export class KeyboardStrategyDefault implements KeyboardStrategy {

  onKeyPress(event: KeyboardEvent, selectio: SelectioPluginComponent, model: ModelService): void {
    console.log(event);
    console.log(selectio);
    if (event.keyCode === KEY_CODE.DOWN_ARROW && !selectio.expanded && selectio.hasFocus()) {
      selectio.expand();
    }
    if (event.keyCode === KEY_CODE.ESC && selectio.expanded && selectio.hasFocus()) {
      selectio.collapse();
    }
    if (event.keyCode === KEY_CODE.ENTER && selectio.source.getHighlited() && selectio.expanded) {
      model.selectHighlitedItem();
    }
    // TODO
    // if (event.keyCode === KEY_CODE.UP_ARROW) {
    //   const currentIndex = list.source.getEnabledSourceItems().indexOf(list.source.getHighlited());
    //   if (currentIndex && currentIndex > 0) {
    //     list.source.setHighlited(list.source.getEnabledSourceItems()[currentIndex - 1]);
    //   }
    //   const item = list.getHighlited();
    //   if (item) {
    //     const top = item.topPosition;
    //     if (top < (list.ul.nativeElement.scrollTop)) {
    //       list.ul.nativeElement.scrollTop -= item.height;
    //     }
    //
    //   }
    // }
    // if (event.keyCode === KEY_CODE.DOWN_ARROW) {
    //   const currentIndex = list.source.getEnabledSourceItems().indexOf(list.source.getHighlited());
    //   if (currentIndex < list.source.getEnabledSourceItems().length - 1) {
    //     list.source.setHighlited(list.source.getEnabledSourceItems()[currentIndex + 1]);
    //   }
    //   const item = list.getHighlited();
    //   if (item) {
    //     const bottom = item.bottomPosition;
    //     if (bottom > (list.ul.nativeElement.offsetHeight + list.ul.nativeElement.scrollTop)) {
    //       list.ul.nativeElement.scrollTop += item.height;
    //     }
    //   }
    // }
  }

}
