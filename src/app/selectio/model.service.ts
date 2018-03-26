import {Injectable} from '@angular/core';
import {Source} from './model/source';
import {Selection} from './model/selection';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {SelectionItem} from './model/selection-item';

@Injectable()
export class ModelService {
  private selection = new Selection();

  private selectionsSubject: Subject<Selection> = new Subject();
  // public $sourceSelections: Subject<SourceItem[]> = new Subject();
  private sourceSubject: Subject<Source> = new Subject();

  constructor() {
    // this.$ngModelSelectionsSubject.next(new Selection());
  }

  get $selectionsObservable(): Observable<Selection> {
    return this.selectionsSubject.asObservable();
  }

  get $sourceObservable(): Observable<Source> {
    return this.sourceSubject.asObservable();
  }

  pushSelectionItems(selectionItems: SelectionItem[]) {
    this.selection.pushAll(selectionItems);
    this.selectionsSubject.next(this.selection);
  }

  setSelection(selection: Selection) {
    this.selection = selection;
    this.selectionsSubject.next(this.selection);
  }

  removeSelectionItem(selectionItem: SelectionItem) {
    this.selection.remove(selectionItem);
    this.selectionsSubject.next(this.selection);
  }

  highlightSelectionItem(selectionItem: SelectionItem) {
    this.selection.highlightedItem = selectionItem;
    this.selectionsSubject.next(this.selection);
  }
}



