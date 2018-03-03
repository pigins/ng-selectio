import {KeyboardStrategy} from './keyboard-strategy';
import {KEY_CODE, SelectioPluginComponent} from '../selectio.component';

export class KeyboardStrategyDefault implements KeyboardStrategy {
  // TODO
  onKeyPress(event: KeyboardEvent, selectio: SelectioPluginComponent): void {

    // if (event.keyCode === KEY_CODE.DOWN_ARROW && !selectio.expanded && selectio.hasFocus()) {
    //   selectio.expand();
    // }
    // selectio.keyEvents.emit(event);
    //
    // let list = selectio.listComponent;
    // if (event.keyCode === KEY_CODE.ENTER && list.source.getHighlited() && !list.isHidden()) {
    //   list.onSelectItem.emit(list.source.getHighlited());
    // }
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
