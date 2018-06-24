import {Injectable} from '@angular/core';
import {Source} from './source';
import {Selection} from './selection';
import {Subject} from 'rxjs';
import {Observable} from 'rxjs';
import {SelectionItem} from './selection-item';
import {Item} from './item';
import {SelectionMode} from './selection-modes';
import {SourceItem} from './source-item';

@Injectable()
export class ModelService {
  private selection: Selection;
  private source: Source;
  private selectionsSubject: Subject<Selection> = new Subject();
  private sourceSubject: Subject<Source> = new Subject();
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
  nextSelection() {
    this.selectionsSubject.next(this.selection);
  }
  nextSource() {
    this.sourceSubject.next(this.source);
  }
  setSelectionMode(selectionMode: SelectionMode) {
    this.selection.setSelectionMode(selectionMode);
    this.nextSelection();
  }
  setSelectionMaxLength(selectionMaxLength: number) {
    this.selection.setSelectionMaxLength(selectionMaxLength);
    this.nextSelection();
  }

  selectHighlitedItem() {
    if (this.source.getHighlited() !== null) {
      this.selectItem(<SourceItem>this.source.getHighlited());
    }
  }

  selectItem(sourceItem: SourceItem) {
    this.selection.updateItems([sourceItem.item]);
    this.source.setSelection(this.selection.getItems());
    this.nextSelection();
    this.nextSource();
  }

  clearSelection() {
    this.selection.clear();
    this.nextSelection();
  }

  removeSelectionItem(selectionItem: SelectionItem) {
    this.selection.remove(selectionItem);
    this.nextSelection();
    this.source.setSelection(this.selection.getItems());
  }

  highlightSelectionItem(selectionItem: SelectionItem) {
    this.selection.setHighlightedItem(selectionItem);
    this.nextSelection();
    this.source.setSelection(this.selection.getItems());
  }

  setSelectionItems(items: Item[]) {
    this.selection.setItems(items);
    this.nextSelection();
  }

  setSourceItems(items: Item[]) {
    this.source.setItems(items);
    this.nextSource();
  }

  appendToSource(data: Item[]) {
    this.source.appendItems(data);
    this.nextSource();
  }

  highlightUpper() {
    this.source.highlightUpper();
  }

  highlightBelow() {
    this.source.highlightBelow();
  }
}



