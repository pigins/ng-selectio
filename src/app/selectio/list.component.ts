import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {Source} from './model/source';
import {SourceFactory} from './model/source-factory';
import {SourceItemDirective} from './source-item.directive';
import {Selection} from './model/selection';
import {SourceItem} from './model/source-item';
import {Subscription} from 'rxjs/Subscription';
import {ModelService} from './model.service';

export enum SourceType {
  TREE = 'tree', ARRAY = 'array'
}

@Component({
  selector: 'selectio-list',
  template: `
    <ng-container *ngTemplateOutlet="aboveUlTemplate;
    context:{source: source, hasScroll: hasScroll()}"></ng-container>
    <ul #ul
        [ngStyle]="{'list-style-type': 'none', 'overflow-y':'auto', position: 'relative'}"
        (scroll)="onUlScroll($event)">
      <li #itemList
          *ngFor="let sourceItem of source | selectionPipe:selection; trackBy: trackByFn"
          [sourceItem]="sourceItem"
          [ngClass]="{'active': !sourceItem.disabled && source.isHighlited(sourceItem), 'selected': sourceItem.selected, 'disabled': sourceItem.disabled}"
          (mouseenter)="source.setHighlited(sourceItem)"
          (click)="onClickItem(sourceItem)">
        <ng-container *ngTemplateOutlet="itemTemplate;context:{sourceItem: sourceItem}"></ng-container>
      </li>
    </ul>
    <ng-container *ngTemplateOutlet="underUlTemplate;
    context:{source: source, hasScroll: hasScroll()}"></ng-container>
  `
})
export class ListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() trackByFn: (index: number, sourceItem: SourceItem) => any;
  // templates
  @Input() itemTemplate: TemplateRef<any>;
  @Input() aboveUlTemplate: TemplateRef<any>;
  @Input() underUlTemplate: TemplateRef<any>;

  // outputs
  @Output() onNextPage = new EventEmitter<void>();
  @Output() afterSelectItems = new EventEmitter<SourceItem[]>();
  @Output() scrollExhausted = new EventEmitter<void>();
  @Output() onListInit = new EventEmitter<void>();

  @ViewChild('ul') ul: ElementRef;
  @ViewChildren('itemList', {read: SourceItemDirective}) itemList: QueryList<SourceItemDirective>;

  source: Source;
  selection: Selection;
  private selectionsSubscription: Subscription;
  private sourceSubscription: Subscription;

  constructor(private model: ModelService) {

  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit() {
    this.sourceSubscription = this.model.$sourceObservable.subscribe(source => this.source = source);
    this.selectionsSubscription = this.model.$selectionsObservable.subscribe(selection => this.selection = selection);
    this.onListInit.emit();
  }

  ngOnDestroy(): void {
    this.sourceSubscription.unsubscribe();
    this.selectionsSubscription.unsubscribe();
  }

  onUlScroll(event: Event) {
    if (this.checkScrollExhausted()) {
      this.scrollExhausted.emit();
    }
  }

  onClickItem(sourceItem: SourceItem) {
    if (sourceItem.disabled) {
      return;
    }
    const sourceItems = [sourceItem];
    this.model.selectItems(sourceItems);
    this.afterSelectItems.emit(sourceItems);
  }

  emitNextPageEvent() {
    this.onNextPage.emit();
  }

  hasScroll(): boolean {
    const ul = this.ul.nativeElement;
    return ul.scrollHeight > ul.clientHeight;
  }

  public scrollToSelection(): void {
    const selectionList = this.itemList.filter((li: SourceItemDirective) => {
      return li.sourceItem.selected;
    });
    if (selectionList.length > 0) {
      const lastSelectedLi = selectionList[selectionList.length - 1];
      this.ul.nativeElement.scrollTop = lastSelectedLi.topPosition;
    }
  }

  public scrollToTheBottom(): void {
    this.ul.nativeElement.scrollTop = this.ul.nativeElement.scrollHeight;
  }

  private checkScrollExhausted(): boolean {
    const ul = this.ul.nativeElement;
    return Math.abs(Math.round(ul.offsetHeight + ul.scrollTop) - Math.round(ul.scrollHeight)) === 0;
  }

  public getHighlited(): SourceItemDirective | null {
    const activeList = this.itemList.filter((li: SourceItemDirective) => {
      return this.source.getHighlited() === li.sourceItem;
    });
    if (activeList.length > 0) {
      return activeList[0];
    } else {
      return null;
    }
  }

  public isHidden() {
    return (this.ul.nativeElement.offsetParent === null);
  }

  public getSource(): Source {
    return this.source;
  }
}
