import {Component, ViewChild, ViewEncapsulation} from '@angular/core';
import 'rxjs/add/observable/of';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {DataService} from '../service/data.service';
import {Item} from '../selectio/model/item';
import {SourceItem} from '../selectio/model/source-item';
import {SelectioPluginComponent} from '../selectio/selectio.component';
import {Selection} from '../selectio/model/selection';

@Component({
  selector: 'selectio-examples-page',
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-template #selectioTemplate>
      Selectio...
    </ng-template>

    <ng-template #countrySourceTemplate let-countryItem="sourceItem">
      <div id="country-iso-name">
        <div class="flag-wrapper">
          <div class="icon-flag" [innerHtml]="countryItem.data.svgFlag | safeHtml"></div>
        </div>
        <span class="country-name">{{countryItem.data.name + '(' + countryItem.data.code + ')'}}</span>
      </div>
    </ng-template>

    <ng-template #countrySelectionTemplate let-countryItem="selectionItem">
      <div id="country-iso-name">
        <div class="flag-wrapper">
          <div class="icon-flag" [innerHtml]="countryItem.data.svgFlag | safeHtml"></div>
        </div>
        <span class="country-name">{{countryItem.data.name + '(' + countryItem.data.code + ')'}}</span>
      </div>
    </ng-template>

    <ng-template #personSourceTemplate let-item="sourceItem">
      {{item.data.name.first}}
    </ng-template>

    <ng-template #personSelectionTemplate let-item="selectionItem">
      {{item.data.name.first}}
    </ng-template>

    <div id="examples-cont">
      <h2>Simple select array of strings</h2>
      <selectio-plugin
        [selectionEmptyTemplate]="selectioTemplate"
        [data]="stringArray"
        [allowClear]="true"
        (afterSourceItemInit)="afterSourceItemInit($event)"
      ></selectio-plugin>
      <h2>Simple select array of objects</h2>
      <selectio-plugin
        [selectionEmptyTemplate]="selectioTemplate"
        [listItemTemplate]="countrySourceTemplate"
        [selectionItemTemplate]="countrySelectionTemplate"
        [data]="objectArray"
        [selectionDefault]="defaultCountry"
      ></selectio-plugin>
      <h2>Simple select array of strings with search</h2>
      <selectio-plugin
        [selectionEmptyTemplate]="selectioTemplate"
        [data]="stringArray"
        [search]="true"
        (onSearch)="onSearchString($event)"
      ></selectio-plugin>
      <h2>Simple select array of strings with search and autocomplete</h2>
      <selectio-plugin
        [selectionEmptyTemplate]="selectioTemplate"
        [data]="stringArray"
        [search]="true"
        [autocomplete]="true"
        (onSearch)="onSearchString($event)"
      ></selectio-plugin>
      <h2>Remote data select with search and pagination</h2>
      <selectio-plugin #remoteSelectio
        [selectionEmptyTemplate]="selectioTemplate"
        [listItemTemplate]="personSourceTemplate"
        [selectionItemTemplate]="personSelectionTemplate"
        [data]="users"
        [appendData]="appendUsers"
        [selectionDefault]="this.dataService.exampleRandomUsers"
        [selectionMode]="'multiple'"
        [search]="true"
        [allowClear]="true"
        [pagination]="true"
        [paginationDelay]="500"
        (onSearch)="onSearch($event)"
        (listScrollExhausted)="onListScrollExhausted()"
      ></selectio-plugin>

      <h2>ngmodel</h2>
      <div>
      <selectio-plugin
        [selectionEmptyTemplate]="selectioTemplate"
        [selectionMode]="'multiple'"
        [(ngModel)]="itemArray"
        [data]="stringArray"
        [allowClear]="true"
      >
      </selectio-plugin>
      <div class="selected-item">{{itemArray | json}}</div>
      </div>
    </div>
  `,
  styles: [`
    #examples-cont {
      padding: 30px 15px;
      margin: 0 auto;
      max-width: 400px;
      width: 100%;
      font-family: "Roboto", sans-serif;
      font-weight: 300;
    }

    #examples-cont h2 {
      padding: 25px 0 5px;
      font-family: "Roboto Condensed", "Roboto", sans-serif;
      font-weight: 300;
      font-size: 20px;
    }

    .selected-item {
      padding: 5px 0 0 5px;
      font-size: 16px;
      color: #5383f8;
      text-align: center;
    }

    .ngs .selection .empty span {
      color: #828282;
    }

    .flag-wrapper {
      display: inline-block;
      vertical-align: middle;
    }

    .flag-wrapper svg {
      border: 1px solid #dedede;
    }

    #country-iso-name {
      max-height: 20px;
    }
  `],
})
export class ExamplesPageComponent {
  stringArray: any = this.dataService.countriesStrings;
  objectArray: any;
  users: any;
  appendUsers: any;
  itemArray: Item[] = ['russia'];
  defaultCountry: Item;

  @ViewChild('remoteSelectio') remoteSelectio: SelectioPluginComponent;

  constructor(private http: Http, public dataService: DataService) {
    this.objectArray = this.dataService.countriesData;
    this.defaultCountry = this.dataService.countriesData[0];
  }

  onSearchString(term: string) {
    this.stringArray = this.dataService.countriesStrings.filter(elem => {
      return (<string>elem).includes(term);
    });
  }

  // IE 9 BUG https://github.com/angular/angular-cli/issues/6110
  onSearch(term: string) {
    if (term === '') {
      this.users = [];
    } else {
      this.http.get(`https://randomuser.me/api?seed=${term}&inc=gender,name,picture&results=${10}&nat=uk`)
        .map(r => r.json()).map(r => r.results).subscribe(r => {
        this.users = r;
      });
    }
  }

  disabledItem(item: any) {
    return item === 'canada';
  }

  afterSourceItemInit(sourceItem: SourceItem) {
    // console.log(sourceItem);
  }

  onListScrollExhausted() {
    const term = this.remoteSelectio.searchComponent.getValue();
    const page = this.remoteSelectio.getSource().size() / 10 + 1;
    this.http.get(`https://randomuser.me/api?seed=${term}&results=${10}&page=${page}&nat=uk&inc=gender,name,picture`)
      .map(r => r.json()).map(r => r.results).subscribe(r => {
      this.appendUsers = r;
      this.remoteSelectio.scrollToTheBottom();
    });
    // setTimeout(() => {
    //   this.onNextPage.emit({currentLength: this.listComponent.source.size(), search: this._searchComponent.getValue()});
    // }, this.paginationDelay);
  }
}
