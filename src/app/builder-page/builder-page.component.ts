import {Component, Input} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {DataService} from '../service/data.service';
import {Item} from '../ng-selectio/item';
import {Template} from '../ng-selectio/template';
import {NgSelectioComponent, SELECTION_MODE_SINGLE} from '../ng-selectio/ng-selectio.component';

@Component({
  selector: 'app-builder-page',
  template: `
    <div>
      <label for="arrds">Simple array of strings</label><input type="radio" name="mode" value="strings" id="arrds" [ngModel]="datasourceId"
                                                               (ngModelChange)="onChangeRadioDatasource($event)"/>
      <label for="objds">Array of objects</label><input type="radio" name="mode" value="objects" id="objds" [ngModel]="datasourceId"
                                                        (ngModelChange)="onChangeRadioDatasource($event)"/>
      <label for="asyncds">Async datasource</label><input type="radio" name="mode" value="remote_objects" id="asyncds"
                                                          [ngModel]="datasourceId" (ngModelChange)="onChangeRadioDatasource($event)"/>
    </div>
    
    <div>
      <h3>Behavior</h3>
      <app-checkbox-input
        [label]="'disabled'"
        [(ngModel)]="disabled">
      </app-checkbox-input>
      <app-checkbox-input
        [label]="'closeAfterSelect'"
        [(ngModel)]="closeAfterSelect">
      </app-checkbox-input>
      <app-checkbox-input
        [label]="'openUp'"
        [(ngModel)]="openUp">
      </app-checkbox-input>
      <app-checkbox-input
        [label]="'search'"
        [(ngModel)]="search">
      </app-checkbox-input>
      <app-number-input
        [label]="'searchDelay'"
        [(ngModel)]="searchDelay">
      </app-number-input>
      <app-number-input
        [label]="'searchMinLength'"
        [(ngModel)]="searchMinLength">
      </app-number-input>
      <app-checkbox-input
        [label]="'autocomplete'"
        [(ngModel)]="autocomplete">
      </app-checkbox-input>
      <app-checkbox-input
        [label]="'scrollToSelectionAfterOpen'"
        [(ngModel)]="scrollToSelectionAfterOpen">
      </app-checkbox-input>


      <app-checkbox-input
        [label]="'allowClear'"
        [(ngModel)]="allowClear">
      </app-checkbox-input>
      <app-checkbox-input
        [label]="'paging'"
        [(ngModel)]="paging">
      </app-checkbox-input>
      
      <app-number-input
        [label]="'pagingDelay'"
        [(ngModel)]="pagingDelay">
      </app-number-input>
      <app-number-input
        [label]="'tabIndex'"
        [(ngModel)]="tabIndex">
      </app-number-input>
      <app-select-input
        [label]="'maxSelectionLength'"
        [options]="[-1, 1, 2]"
        [(ngModel)]="maxSelectionLength">
      </app-select-input>
      <app-select-input
        [label]="'selectionMode'"
        [options]="['single', 'multiple']"
        [(ngModel)]="selectionMode">
      </app-select-input>
      <div>
        <app-select-input style="display: inline-block"
                          [label]="'defaultSelectionRule'"
                          [options]="[{label: 'none', value: defaultSelectionRule_none}, {label: 'select first', value: defaultSelectionRule_selectFirst}]"
                          [(ngModel)]=defaultSelectionRule>
        </app-select-input>
        <button (click)="recreateSelectio()" style="display: inline-block">recreate selectio</button>
      </div>
      <app-select-input style="display: inline-block"
                        [label]="'defaultSelection'"
                        [options]="[{label: 'null', value: null}, {label: 'user', value: defaultSelection_user}]"
                        [(ngModel)]=defaultSelection>
      </app-select-input>
      <app-select-input
        [label]="'dropdownDisabledItemMapper'"
        [options]="[{label: 'all disabled', value: dropdownDisabledItemMapper_allDisabled}, {label: 'all enabled', value: dropdownDisabledItemMapper_allEnabled}]"
        [(ngModel)]=dropdownDisabledItemMapper>
      </app-select-input>
      <app-select-input
        [label]="'trackByFn'"
        [options]="[{label: 'none', value: null}, {label: 'by index', value: trackByFn_byIndex}]"
        [(ngModel)]=trackByFn>
      </app-select-input>
    </div>
   
    <div class="input-group">
      <h3>View</h3>
      <app-text-input
        [label]="'placeholder'"
        [(ngModel)]="placeholder">
      </app-text-input>
      <app-text-input
        [label]="'dropdownMaxHeight'"
        [(ngModel)]="dropdownMaxHeight">
      </app-text-input>
      <app-select-input
        [label]="'dropdownItemRenderer'"
        [options]="[{label: 'default', value: itemRenderer_default}, {label: 'country', value: itemRenderer_renderCountry}, {label: 'user', value: itemRenderer_renderUser}]"
        [(ngModel)]=dropdownItemRenderer>
      </app-select-input>
      <app-select-input
        [label]="'selectionItemRenderer'"
        [options]="[{label: 'default', value: itemRenderer_default}, {label: 'country', value: itemRenderer_renderCountry}, {label: 'user', value: itemRenderer_renderUser}]"
        [(ngModel)]="selectionItemRenderer">
      </app-select-input>
      <app-select-input
        [label]="'dropdownEmptyRenderer'"
        [options]="[{label: 'default', value: dropdownEmptyRenderer_default}, {label: 'null', value: null}, {label: 'user', value: dropdownEmptyRenderer_empty}]"
        [(ngModel)]="dropdownEmptyRenderer">
      </app-select-input>
      <app-select-input
        [label]="'dropdownPagingMessageRenderer'"
        [options]="[{label: 'default', value: dropdownPagingMessageRenderer_default}, {label: 'null', value: null}]"
        [(ngModel)]="dropdownPagingMessageRenderer">
      </app-select-input>
      <app-select-input
        [label]="'dropdownPagingButtonRenderer'"
        [options]="[{label: 'default', value: dropdownPagingButtonRenderer_default}, {label: 'null', value: null}]"
        [(ngModel)]="dropdownPagingButtonRenderer">
      </app-select-input>
      <app-select-input
        [label]="'dropdownSearchingRenderer'"
        [options]="[{label: 'default', value: dropdownSearchingRenderer_default}, {label: 'null', value: null}]"
        [(ngModel)]="dropdownSearchingRenderer">
      </app-select-input>
      <app-select-input
        [label]="'selectionEmptyRenderer'"
        [options]="[{label: 'default', value: selectionEmptyRenderer_default}, {label: 'null', value: null}]"
        [(ngModel)]="selectionEmptyRenderer">
      </app-select-input>
    </div>
    

    <div>
      <p>Select</p>
      <app-ng-selectio *ngIf="showSelectio"
        [$data]="$data"
        [$appendData]="$appendData"
        [selectionMode]="selectionMode" 
        [defaultSelectionRule]="defaultSelectionRule"
        [defaultSelection]="defaultSelection" 
        [scrollToSelectionAfterOpen]="scrollToSelectionAfterOpen"
        [searchDelay]="searchDelay"
        [searchMinLength]="searchMinLength"
        [search]="search"
        [paging]="paging"
        [autocomplete]="autocomplete"
        [pagingDelay]="pagingDelay"
        [disabled]="disabled"
        [closeAfterSelect]="closeAfterSelect"
        [maxSelectionLength]="maxSelectionLength"
        [allowClear]="allowClear"
        [openUp]="openUp"
        [dropdownDisabledItemMapper]="dropdownDisabledItemMapper"
        [dropdownItemRenderer]="dropdownItemRenderer"
        [selectionItemRenderer]="selectionItemRenderer"
        [placeholder]="placeholder"
        [dropdownMaxHeight]="dropdownMaxHeight"
        [dropdownEmptyRenderer]="dropdownEmptyRenderer"
        [dropdownPagingMessageRenderer]="dropdownPagingMessageRenderer" 
        [dropdownPagingButtonRenderer]="dropdownPagingButtonRenderer"
        [dropdownSearchingRenderer]="dropdownSearchingRenderer"
        [selectionEmptyRenderer]="selectionEmptyRenderer"
        [tabIndex]="tabIndex"
        [trackByFn]="trackByFn"
        (onSearch)="onSearch($event)"
        (onNextPage)="onNextPage($event)"
      ></app-ng-selectio>
    </div>
  `,
  styleUrls: ['./builder-page.component.css']
})
export class BuilderPageComponent {

  defaultSelection_user = {"gender":"male","name":{"title":"mr","first":"christian","last":"bennett"},"picture":{"large":"https://randomuser.me/api/portraits/men/80.jpg","medium":"https://randomuser.me/api/portraits/med/men/80.jpg","thumbnail":"https://randomuser.me/api/portraits/thumb/men/80.jpg"}}
  // defaults
  defaultSelectionRule_selectFirst(items: Item[]): Item[] {
    return [items[0]];
  }
  defaultSelectionRule_none(items: Item[]): Item[] {
    return [];
  }
  dropdownDisabledItemMapper_allDisabled(item: Item): boolean {
    return true;
  }
  dropdownDisabledItemMapper_allEnabled(item: Item): boolean {
    return false;
  }
  trackByFn_byIndex(index: number, item: Item): any {
    return index;
  }
  itemRenderer_default(item: any): string {
    return NgSelectioComponent.defaultItemRenderer(item);
  }
  itemRenderer_renderUser(item: any): string {
    return item.name.first;
  }
  itemRenderer_renderCountry(countryItem: any): string {
    return `<div id="country-iso-name" class=${countryItem.isoName}>
               <div class="flag-wrapper"><div class="icon-flag">${countryItem.svgFlag}</div></div>
               <span class="country-name">${countryItem.name + ' (+' + countryItem.code + ')'}</span>
           </div>`;
  }
  dropdownEmptyRenderer_default = 'Enter 1 or more characters';
  dropdownEmptyRenderer_empty = 'empty';
  dropdownPagingMessageRenderer_default = 'Loading more results...';
  dropdownPagingButtonRenderer_default = 'Get more...';
  dropdownSearchingRenderer_default = 'Searching...';
  selectionEmptyRenderer_default = 'No data';

  $data: Observable<Item[]> = this.dataService.countriesStrings;
  $appendData: Observable<Item[]> = Observable.of([]);

  selectionMode: string = SELECTION_MODE_SINGLE;
  defaultSelection: Item | Item[] | null = null;
  defaultSelectionRule: (items: Item[]) => Item[] = this.defaultSelectionRule_none;
  allowClear: boolean = false;

  searchDelay: number = 0;
  searchMinLength: number = 0;
  search: boolean = false;
  pagingDelay: number = 0;
  paging: boolean = false;
  autocomplete: boolean = false;
  disabled: boolean = false;
  closeAfterSelect: boolean = true;
  maxSelectionLength: number = -1;

  dropdownDisabledItemMapper: (item: Item) => boolean = this.dropdownDisabledItemMapper_allEnabled;
  tabIndex: number = 1;
  trackByFn: ((index: number, item: Item) => any) | null = null;
  openUp: boolean = false;
  scrollToSelectionAfterOpen: boolean = true;

  dropdownItemRenderer: Template<(countryItem: Item, disabled: boolean) => string> = this.itemRenderer_default;
  selectionItemRenderer: Template<(item: Item) => string> = this.itemRenderer_default;
  dropdownMaxHeight: string = '100px';
  placeholder: string = '';
  dropdownEmptyRenderer: Template<() => string> = this.dropdownEmptyRenderer_default;
  dropdownPagingMessageRenderer: Template<() => string> = this.dropdownPagingMessageRenderer_default;
  dropdownPagingButtonRenderer: Template<() => string> = this.dropdownPagingButtonRenderer_default;
  dropdownSearchingRenderer: Template<() => string> = this.dropdownSearchingRenderer_default;
  selectionEmptyRenderer: Template<() => string> = this.selectionEmptyRenderer_default;

  datasourceId: string = 'strings';
  showSelectio = true;

  constructor(private http: Http, private dataService: DataService) {
  }

  recreateSelectio() {
    this.showSelectio = false;
    setTimeout(()=> {
      this.showSelectio = true;
    }, 100);
  }

  onChangeRadioDatasource(id: string) {
    if (id === 'strings') {
      this.datasourceId = id;
      // set on search function
      this.$data = this.dataService.countriesStrings;
    } else if (id === 'objects') {
      this.datasourceId = id;
      this.$data = this.dataService.countriesData;
    } else if (id === 'remote_objects') {
      this.datasourceId = id;
      this.$data = Observable.of([]);
    }
  }

  onSearch(term: string) {
    if (this.datasourceId === 'remote_objects') {
      if (term === '') {
        this.$data = Observable.of([]);
      } else {
        this.$data = this.http.get(`https://randomuser.me/api?seed=${term}&inc=gender,name,picture&results=${10}&nat=uk`)
          .map(r => r.json()).map(r => r.results);
      }
    } else if (this.datasourceId === 'strings') {
      this.$data = this.dataService.countriesStrings.mergeMap((arr) => {
        return Observable.of(arr.filter((elem) => {
          return (<string>elem).includes(term);
        }));
      });
    } else if (this.datasourceId === 'objects') {
      this.$data = this.dataService.countriesData.mergeMap((arr) => {
        return Observable.of(arr.filter((elem) => {
          return ((<any>elem).name).includes(term);
        }));
      });
    }
  }

  onNextPage(paging) {
    if (this.datasourceId === 'remote_objects') {
      this.$appendData = this.http.get(`https://randomuser.me/api?seed=${paging.term}&results=${10}&page=${paging.currentLength / 10 + 1}&nat=uk&inc=gender,name,picture`)
        .map(r => r.json()).map(r => r.results);
    }
  }

}
