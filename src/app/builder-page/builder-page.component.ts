import { Component } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {DataService} from '../service/data.service';
import {Item} from '../ng-selectio/item';

@Component({
  selector: 'app-builder-page',
  template: `
    <div>
      <p><input type="radio"/>Simple array of strings</p>
      <p><input type="radio"/>array of objects</p>
      <p><input type="radio"/>remote resource objects</p>
    </div>
    
    
    
  <app-checkbox-input
    [label]="'Disabled'"
    (valueChange)="disabled = $event">
  </app-checkbox-input>
  <app-checkbox-input
    [label]="'Close on select'"
    (valueChange)="closeOnSelect = $event">
  </app-checkbox-input>
  <app-checkbox-input
    [label]="'Open on top'"
    (valueChange)="openOnTop = $event">
  </app-checkbox-input>
  <app-checkbox-input
    [label]="'Show search'"
    (valueChange)="showSearch = $event">
  </app-checkbox-input>
  <app-checkbox-input
    [label]="'autocomplete'"
    (valueChange)="autocomplete = $event">
  </app-checkbox-input>
  <app-checkbox-input
    [label]="'Selection deletable'"
    (valueChange)="selectionDeletable = $event">
  </app-checkbox-input>
  <app-number-input
    [label]="'Search start length'"
    (valueChange)="searchDelay = +$event">
  </app-number-input>
  <app-number-input
    [label]="'Search delay'"
    (valueChange)="searchStartLength = +$event">
  </app-number-input>
  <app-number-input
    [label]="'Paging delay'"
    (valueChange)="searchStartLength = +$event">
  </app-number-input>
  <app-number-input
    [label]="'tabIndex'"
    (valueChange)="tabIndex = +$event">
  </app-number-input>
  <app-select-input
    [label]="'Max selection items count'"
    [options]="['-1', '1', '2']"
    (valueChange)="maxSelectionLength = +$event">
  </app-select-input>
  <app-select-input
    [label]="'Max dropdown height'"
    [options]="['100px', '200px']"
    (valueChange)="maxDropdownHeight = $event">
  </app-select-input>
  <app-select-input
    [label]="'Selection mode'"
    [options]="['single', 'multiple']"
    (valueChange)="selectionMode = $event">
  </app-select-input>
  <app-select-input
    [label]="'Default Selection Rule'"
    [options]="['select first', 'none']"
    (valueChange)="onChangeDefaultSelectionRule($event)">
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
  
  <div>
    <p>Select</p>
    <app-ng-selectio
      [$data]="$users"
      [$appendData]="$appendUsers"
      
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
      [dropdownItemRenderer]="renderItem"
      [dropdownMaxHeight]="maxDropdownHeight"
      [selectionItemRenderer]="renderItem"
      [selectionDeletable]="selectionDeletable"
      [openOnTop]="openOnTop"
      [defaultSelectionRule]="defaultSelectionRule"
      [dropdownDisabledItemMapper]="dropdownDisabledItemMapper"
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
  $stringArray: Observable<any> = Observable.of(this.dataService.countriesStrings);
  $objectArray: Observable<any>;
  $users: Observable<any>;
  $appendUsers: Observable<any>;
  disabled = false;
  closeOnSelect = true;
  maxSelectionLength: number = -1;
  maxDropdownHeight: string = '100px';
  openOnTop = false;
  selectionMode: string;
  showSearch: boolean;
  searchDelay: number;
  searchStartLength: number;
  pagingDelay: number;
  paging: boolean;
  autocomplete: boolean;
  defaultSelectionRule: (items: Item[]) => Item[];
  selectionDeletable: boolean;
  dropdownDisabledItemMapper: (item: Item) => boolean;
  tabIndex: number;
  trackByFn: ((index: number, item: Item) => any) | null;

  constructor(private http: Http, private dataService: DataService) {
    this.$objectArray = Observable.of(dataService.countriesData);
  }
  onSearchString(term: string) {
    this.$stringArray = Observable.of(this.dataService.countriesStrings.filter((elem) => {
      return elem.includes(term);
    }));
  }
  onSearch(term: string) {
    if (term === '') {
      this.$users = Observable.of([]);
    } else {
      this.$users = this.http.get(`https://randomuser.me/api?seed=${term}&inc=gender,name,picture&results=${10}&nat=uk`)
        .map(r => r.json()).map(r => r.results);
    }
  }
  onNextPage(paging) {
    this.$appendUsers = this.http.get(`https://randomuser.me/api?seed=${paging.term}&results=${10}&page=${paging.currentLength / 10 + 1}&nat=uk&inc=gender,name,picture`)
      .map(r => r.json()).map(r => r.results);
  }

  disabledItem(item: any) {
    return item === 'canada';
  }

  renderItem(item: any) {
    return item.name.first;
  }

  renderCountry(countryItem: any): string {
    return `<div id="country-iso-name" class=${countryItem.isoName}>
               <div class="flag-wrapper"><div class="icon-flag">${countryItem.svgFlag}</div></div>
               <span class="country-name">${countryItem.name + ' (+' + countryItem.code + ')'}</span>
           </div>`;
  }
  noDataRenderer() {
    return 'Empty';
  }

  onSelectCountry(country: any) {

  }

  onChangeDefaultSelectionRule(ruleId: string):void {
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
}
