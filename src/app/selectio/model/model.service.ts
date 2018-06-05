
import {EventEmitter, Injectable, Output} from '@angular/core';
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
  private selection: Selection;
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

  setSelection(selection: Selection) {
    this.selection = selection;
  }

  setSource(instance: Source) {
    this.source = instance;
  }

  selectHighlitedItem() {
    this.selectItem(this.source.getHighlited());
  }

  selectItem(sourceItem: SourceItem) {
    this.selection.updateItems([sourceItem.data]);
    this.source.setSelection(this.selection.getItems());
    this.nextSelection();
    this.nextSource();
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
  setSourceData(items: Item[]) {
    this.source.setItems(items);
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
      return new SelectionItem(dataItem, false);
    });
    this.pushSelectionItems(selectionItems);
  }

  setSelectionMode(selectionMode: SelectionMode) {
    this.selection.setSelectionMode(selectionMode);
    this.nextSelection();
  }

  setSelectionMaxLength(selectionMaxLength: number) {
    this.selection.setSelectionMaxLength(selectionMaxLength);
    this.nextSelection();
  }

  setSelectionItems(items: Item[]) {
    this.selection.setItems(items);
    this.nextSelection();
  }

  nextSelection() {
    this.selectionsSubject.next(this.selection);
  }

  nextSource() {
    this.sourceSubject.next(this.source);
  }

  setAfterSourceItemInit(currentValue: any) {

  }


}



