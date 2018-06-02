import {Injectable} from '@angular/core';
import {Source} from './source';
import {Selection} from './selection';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {SelectionItem} from './selection-item';
import {SourceFactory} from './source-factory';
import {Item} from './item';
import {SelectionMode} from './selection-modes';
import {SourceItem} from './source-item';
import {SourceType} from './source-types';

@Injectable()
export class ModelService {
  private selection = new Selection();
  private source: Source;

  private selectionsSubject: Subject<Selection> = new Subject();
  private sourceSubject: Subject<Source> = new Subject();

  private equals: (item1: Item, item2: Item) => boolean = ((item1, item2) => item1 === item2);
  private selectionMode: SelectionMode = SelectionMode.SINGLE;
  private selectionMaxLength: number = -1;

  constructor() {
  }

  get $selectionsObservable(): Observable<Selection> {
    return this.selectionsSubject.asObservable();
  }

  get $sourceObservable(): Observable<Source> {
    return this.sourceSubject.asObservable();
  }

  selectHighlitedItem() {
    const sourceItem = this.source.getHighlited();
    this.selection.push(sourceItem.data);
    this.nextSelection();
    if (this.source) {
      this.source.setSelection(this.selection.getItems());
    }
  }

  clearSelection() {
    this.getSelection().clear();
    this.nextSelection();
  }

  pushSelectionItems(selectionItems: SelectionItem[]) {
    this.selection.pushAll(selectionItems);
    this.nextSelection();
    if (this.source) {
      this.source.setSelection(this.selection.getItems());
    }
  }

  setSelection(selection: Selection) {
    this.selection = selection;
    this.nextSelection();
    if (this.source) {
      this.source.setSelection(this.selection.getItems());
    }
  }

  removeSelectionItem(selectionItem: SelectionItem) {
    this.selection.remove(selectionItem);
    this.nextSelection();
    if (this.source) {
      this.source.setSelection(this.selection.getItems());
    }
  }

  highlightSelectionItem(selectionItem: SelectionItem) {
    this.selection.setHighlightedItem(selectionItem);
    this.nextSelection();
    if (this.source) {
      this.source.setSelection(this.selection.getItems());
    }
  }

  setSource(sourceType: SourceType, data: Item[], itemInitCallback: (sourceItem) => void) {
    this.source = SourceFactory.getInstance(sourceType, this.equals, data, itemInitCallback);
    this.nextSource();
  }

  appendToSource(data: Item[]) {
    this.source.appendItems(data);
    this.nextSource();
  }

  selectionSize(): number {
    return this.selection.size();
  }

  getSelection(): Selection {
    return this.selection;
  }

  pushItemsToSelection(selection: Item[]) {
    const selectionItems = selection.map((dataItem: Item) => {
      return new SelectionItem(dataItem, false, this.equals);
    });
    this.pushSelectionItems(selectionItems);
  }

  setEquals(equals: (item1: Item, item2: Item) => boolean) {
    this.equals = equals;
  }

  setSelectionMode(selectionMode: SelectionMode) {
    this.selectionMode = selectionMode;
    this.selection.setSelectionMode(selectionMode);
  }

  setSelectionMaxLength(selectionMaxLength: number) {
    this.selectionMaxLength = selectionMaxLength;
  }

  selectItems(sourceItems: SourceItem[]) {
    if (this.selectionMode === SelectionMode.SINGLE) {
      const dataItem = sourceItems[0].data;
      this.setSelection(new Selection([dataItem]));
    } else if (this.selectionMode === SelectionMode.MULTIPLE) {
      if (this.selectionMaxLength < 0 || (this.selectionSize() + 1 <= this.selectionMaxLength)) {
        const selectionItems = sourceItems.map((sourceItem: SourceItem) => {
          return new SelectionItem(sourceItem.data, false, this.equals);
        });
        this.pushSelectionItems(selectionItems);
      }
    }
  }

  nextSelection() {
    this.selectionsSubject.next(this.selection);
  }

  nextSource() {
    this.sourceSubject.next(this.source);
  }

  setSelectionItems(items: Item[]) {
    this.selection.setItems(items);
    this.nextSelection();
  }
}



