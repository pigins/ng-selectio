import {Component} from '@angular/core';
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
      <label for="arrds">Simple array of strings</label><input type="radio" name="mode" value="strings" id="arrds" [ngModel]="datasourceId" (ngModelChange)="onChangeRadioDatasource($event)"/>
      <label for="objds">Array of objects</label><input type="radio" name="mode" value="objects" id="objds" [ngModel]="datasourceId" (ngModelChange)="onChangeRadioDatasource($event)"/>
      <label for="asyncds">Async datasource</label><input type="radio" name="mode" value="remote_objects" id="asyncds" [ngModel]="datasourceId" (ngModelChange)="onChangeRadioDatasource($event)"/>
    </div>

    <app-checkbox-input
      [label]="'disabled'"
      [(ngModel)] = "disabled">
    </app-checkbox-input>
    <app-checkbox-input
      [label]="'closeOnSelect'"
      [(ngModel)] = "closeOnSelect">
    </app-checkbox-input>
    <app-checkbox-input
      [label]="'openOnTop'"
      [(ngModel)] = "openOnTop">
    </app-checkbox-input>
    <app-checkbox-input
      [label]="'showSearch'"
      [(ngModel)] = "showSearch">
    </app-checkbox-input>
    <app-checkbox-input
      [label]="'autocomplete'"
      [(ngModel)] = "autocomplete">
    </app-checkbox-input>
    <app-checkbox-input
      [label]="'selectionDeletable'"
      [(ngModel)] = "selectionDeletable">
    </app-checkbox-input>
    <app-number-input
      [label]="'searchStartLength'"
      [(ngModel)] = "searchStartLength">
    </app-number-input>
    <app-number-input
      [label]="'searchDelay'"
      [(ngModel)] = "searchDelay">
    </app-number-input>
    <app-number-input
      [label]="'pagingDelay'"
      [(ngModel)] = "pagingDelay">
    </app-number-input>
    <app-number-input
      [label]="'tabIndex'"
      [(ngModel)] = "tabIndex">
    </app-number-input>
    <app-text-input
      [label]="'dropdownMaxHeight'"
      [(ngModel)]="dropdownMaxHeight">
    </app-text-input>
    <app-text-input
      [label]="'placeholder'"
      [(ngModel)]="placeholder">
    </app-text-input>
    <app-select-input
      [label]="'maxSelectionLength'"
      [options]="['-1', '1', '2']"
      [(ngModel)]="maxSelectionLength">
    </app-select-input>
    <app-select-input
      [label]="'selectionMode'"
      [options]="['single', 'multiple']"
      [(ngModel)]="selectionMode">
    </app-select-input>
    <app-select-input
      [label]="'Default Selection Rule'"
      [options]="[{label: 'none', value: defaultSelectionRule_none}, {label: 'select first', value: defaultSelectionRule_selectFirst}]"
      [(ngModel)] = defaultSelectionRule>
    </app-select-input>
    <app-select-input
      [label]="'Dropdown disabled item mappers'"
      [options]="['disable all', 'none']"
      (valueChange)="onChangeDropdownDisabledItemMapper($event)">
    </app-select-input>
    <app-select-input
      [label]="'Track by function'"
      [options]="['none', 'by index']"
      (valueChange)="onChangeTrackByFunction($event)">
    </app-select-input>
    <app-select-input
      [label]="'Dropdown item renderer'"
      [options]="['default', 'country', 'user']"
      (valueChange)="onChangeDropdownItemRenderer($event)">
    </app-select-input>
    <app-select-input
      [label]="'Selection item renderer'"
      [options]="['default', 'country', 'user']"
      (valueChange)="onChangeSelectionItemRenderer($event)">
    </app-select-input>
    <app-select-input
      [label]="'dropdownEmptyRenderer'"
      [options]="['default', 'null', 'empty']"
      (valueChange)="onChangeDropdownEmptyRenderer($event)">
    </app-select-input>
    <app-select-input
      [label]="'dropdownPagingMessageRenderer'"
      [options]="['default', 'null']"
      (valueChange)="onChangeDropdownPagingMessageRenderer($event)">
    </app-select-input>
    <app-select-input
      [label]="'dropdownSearchingRenderer'"
      [options]="['default', 'null']"
      (valueChange)="onChangeDropdownSearchingRenderer($event)">
    </app-select-input>
    <app-select-input
      [label]="'selectionEmptyRenderer'"
      [options]="['default', 'null']"
      (valueChange)="onChangeSelectionEmptyRenderer($event)">
    </app-select-input>
    
    <div>
      <p>Select</p>
      <app-ng-selectio
        [$data]="$data"
        [$appendData]="$appendData"
        [selectionMode]="selectionMode"
        [searchDelay]="searchDelay"
        [searchStartLength]="searchStartLength"
        [showSearch]="showSearch"
        [paging]="paging"
        [autocomplete]="autocomplete"
        [pagingDelay]="pagingDelay"
        [disabled]="disabled"
        [closeOnSelect]="closeOnSelect"
        [maxSelectionLength]="maxSelectionLength"
        [selectionDeletable]="selectionDeletable"
        [openOnTop]="openOnTop"
        [defaultSelectionRule]="defaultSelectionRule"
        [dropdownDisabledItemMapper]="dropdownDisabledItemMapper"
        [dropdownItemRenderer]="dropdownItemRenderer"
        [selectionItemRenderer]="selectionItemRenderer"
        [placeholder]="placeholder"
        [dropdownMaxHeight]="dropdownMaxHeight"
        [dropdownEmptyRenderer]="dropdownEmptyRenderer"
        [dropdownPagingMessageRenderer]="dropdownPagingMessageRenderer"
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
  $data: Observable<Item[]> = Observable.empty();
  $appendData: Observable<Item[]> = Observable.empty();
  selection: Item[] = [];

  selectionMode: string = SELECTION_MODE_SINGLE;
  searchDelay: number = 0;
  searchStartLength: number = 0;
  showSearch: boolean = false;
  pagingDelay: number = 0;
  paging: boolean = false;
  autocomplete: boolean = false;
  disabled: boolean = false;
  closeOnSelect: boolean = true;
  maxSelectionLength: number = -1;
  defaultSelectionRule: (items: Item[]) => Item[] = this.defaultSelectionRule_none;
  selectionDeletable: boolean = false;
  dropdownDisabledItemMapper: (item: Item) => boolean = (item: Item) => false;
  tabIndex: number = 1;
  trackByFn: ((index: number, item: Item) => any) | null = null;
  openOnTop: boolean = false;

  dropdownItemRenderer: Template<(countryItem: Item, disabled: boolean) => string> = NgSelectioComponent.defaultItemRenderer;
  selectionItemRenderer: Template<(item: Item) => string> = NgSelectioComponent.defaultItemRenderer;
  dropdownMaxHeight: string = '100px';
  placeholder: string = '';
  dropdownEmptyRenderer: Template<() => string> = 'Enter 1 or more characters';
  dropdownPagingMessageRenderer: Template<() => string> = 'Loading more results...';
  dropdownSearchingRenderer: Template<() => string> = 'Searching...';
  selectionEmptyRenderer: Template<() => string> = 'No data';

  datasourceId: string = 'strings';

  constructor(private http: Http, private dataService: DataService) {
  }

  defaultSelectionRule_selectFirst(items: Item[]): Item[] {
    return [items[0]];
  }
  defaultSelectionRule_none(items: Item[]): Item[] {
    return [];
  }

  onChangeDefaultSelectionRule(ruleId: string): void {
    if (ruleId === 'select first') {
      this.defaultSelectionRule = (items: Item[]): Item[] => [items[0]];
    } else if (ruleId === 'none') {
      this.defaultSelectionRule = (items: Item[]): Item[] => [];
    }
  }

  onChangeDropdownDisabledItemMapper(mapperId: string) {
    // TODO add index into function
    if (mapperId === 'disable all') {
      this.dropdownDisabledItemMapper = (item: Item) => false;
    } else if (mapperId === 'none') {
      this.dropdownDisabledItemMapper = (item: Item) => true;
    }
  }

  onChangeTrackByFunction(id: string) {
    if (id === 'by index') {
      this.trackByFn = (index: number, item: Item) => {
        return index;
      };
    } else if (id === 'none') {
      this.trackByFn = null;
    }
  }

  renderUser(item: any) {
    return item.name.first;
  }

  renderCountry(countryItem: any): string {
    return `<div id="country-iso-name" class=${countryItem.isoName}>
               <div class="flag-wrapper"><div class="icon-flag">${countryItem.svgFlag}</div></div>
               <span class="country-name">${countryItem.name + ' (+' + countryItem.code + ')'}</span>
           </div>`;
  }

  onChangeDropdownItemRenderer(id: string) {
    if (id === 'default') {
      this.dropdownItemRenderer = NgSelectioComponent.defaultItemRenderer;
    } else if (id === 'country') {
      this.dropdownItemRenderer = this.renderCountry;
    } else if (id === 'user') {
      this.dropdownItemRenderer = this.renderUser;
    }
  }

  onChangeSelectionItemRenderer(id: string) {
    if (id === 'default') {
      this.selectionItemRenderer = NgSelectioComponent.defaultItemRenderer;
    } else if (id === 'country') {
      this.selectionItemRenderer = this.renderCountry;
    } else if (id === 'user') {
      this.selectionItemRenderer = this.renderUser;
    }
  }

  onChangeDropdownEmptyRenderer(id: string) {
    if (id === 'default') {
      this.dropdownEmptyRenderer = 'Enter 1 or more characters';
    } else if (id === 'null') {
      this.dropdownEmptyRenderer = null;
    } else if (id === 'empty') {
      this.dropdownEmptyRenderer = 'empty';
    }
  }

  onChangeDropdownPagingMessageRenderer(id: string) {
    if (id === 'default') {
      this.dropdownEmptyRenderer = 'Loading more results...';
    } else if (id === 'null') {
      this.dropdownEmptyRenderer = null;
    }
  }

  onChangeDropdownSearchingRenderer(id: string) {
    if (id === 'default') {
      this.dropdownSearchingRenderer = 'Searching...';
    } else if (id === 'null') {
      this.dropdownSearchingRenderer = null;
    }
  }

  onChangeSelectionEmptyRenderer(id: string) {
    if (id === 'default') {
      this.selectionEmptyRenderer = 'No data';
    } else if (id === 'null') {
      this.selectionEmptyRenderer = null;
    }
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
      // TODO
      //this.dropdownEmptyRenderer = 'empty';
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
        this.$data = this.dataService.countriesStrings.filter((elem) => {
          return elem.includes(term);
        });
    } else if (this.datasourceId === 'objects') {
      // TODO
    }
  }

  onNextPage(paging) {
    if (this.datasourceId === 'remote_objects') {
      this.$appendData = this.http.get(`https://randomuser.me/api?seed=${paging.term}&results=${10}&page=${paging.currentLength / 10 + 1}&nat=uk&inc=gender,name,picture`)
        .map(r => r.json()).map(r => r.results);
    }
  }

}
