import {Injectable} from '@angular/core';
import {Source} from './model/source';
import {Selection} from './model/selection';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {SelectionItem} from './model/selection-item';
import {SourceFactory} from './model/source-factory';
import {Item} from './model/item';
import {SELECTION_MODE_MULTIPLE, SELECTION_MODE_SINGLE, SourceType} from './selectio.component';
import {SourceItem} from './model/source-item';

@Injectable()
export class ModelService {
  private selection = new Selection();
  private source: Source;

  private selectionsSubject: Subject<Selection> = new Subject();
  private sourceSubject: Subject<Source> = new Subject();

  private equals: (item1: Item, item2: Item) => boolean = ((item1, item2) => item1 === item2);
  private selectionMode: string = SELECTION_MODE_SINGLE;
  private selectionMaxLength: number = -1;

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
    this.source = SourceFactory.getInstance(sourceType, this.equals, data, itemInitCallback);
    this.sourceSubject.next(this.source);
  }

  appendToSource(data: Item[]) {
    this.source.appendDataItems(data);
    this.sourceSubject.next(this.source);
  }

  selectionSize(): number {
    return this.selection.size();
  }

  pushItemsToSelection(selectionDefault: Item[]) {
    const selectionItems = selectionDefault.map((dataItem: Item) => {
      return new SelectionItem(dataItem, false, this.equals);
    });
    this.pushSelectionItems(selectionItems);
  }

  setEquals(equals: (item1: Item, item2: Item) => boolean) {
    this.equals = equals;
  }

  setSelectionMode(selectionMode: string) {
    this.selectionMode = selectionMode;
  }

  setSelectionMaxLength(selectionMaxLength: number) {
    this.selectionMaxLength = selectionMaxLength;
  }

  selectItems(sourceItems: SourceItem[]) {
    if (this.selectionMode === SELECTION_MODE_SINGLE) {
      const dataItem = sourceItems[0].data;
      this.setSelection(new Selection([dataItem]));
    } else if (this.selectionMode === SELECTION_MODE_MULTIPLE) {
      if (this.selectionMaxLength < 0 || (this.selectionSize() + 1 <= this.selectionMaxLength)) {
        const selectionItems = sourceItems.map((sourceItem: SourceItem) => {
          return new SelectionItem(sourceItem.data, false, this.equals);
        });
        this.pushSelectionItems(selectionItems);
      }
    }
  }
}



