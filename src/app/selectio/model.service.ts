import {Injectable} from '@angular/core';
import {Source} from './model/source';
import {Selection} from './model/selection';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {SelectionItem} from './model/selection-item';
import {SourceType} from './list.component';
import {SourceFactory} from './model/source-factory';
import {Item} from './model/item';

@Injectable()
export class ModelService {
  private selection = new Selection();
  private source: Source;

  private selectionsSubject: Subject<Selection> = new Subject();
  private sourceSubject: Subject<Source> = new Subject();

  constructor() {
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
    if (this.source) {
      this.source.updateSelection(this.selection.toDataArray());
    }
  }

  setSelection(selection: Selection) {
    this.selection = selection;
    this.selectionsSubject.next(this.selection);
    if (this.source) {
      this.source.updateSelection(this.selection.toDataArray());
    }
  }

  removeSelectionItem(selectionItem: SelectionItem) {
    this.selection.remove(selectionItem);
    this.selectionsSubject.next(this.selection);
    if (this.source) {
      this.source.updateSelection(this.selection.toDataArray());
    }
  }

  highlightSelectionItem(selectionItem: SelectionItem) {
    this.selection.highlightedItem = selectionItem;
    this.selectionsSubject.next(this.selection);
    if (this.source) {
      this.source.updateSelection(this.selection.toDataArray());
    }
  }

  setSource(sourceType: SourceType, data: Item[], itemInitCallback: (sourceItem) => void) {
    this.source = SourceFactory.getInstance(sourceType, data, itemInitCallback);
    this.sourceSubject.next(this.source);
  }

  appendToSource(data: Item[]) {
    this.source.appendDataItems(data);
    this.sourceSubject.next(this.source);
  }

  selectionSize(): number {
    return this.selection.size();
  }
}



