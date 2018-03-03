import {Component, ViewEncapsulation} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {DataService} from '../service/data.service';
import {Item} from '../selectio/model/item';
import {SourceItem} from '../selectio/model/source-item';

@Component({
  selector: 'selectio-examples-page',
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-template #selectioTemplate>
      Selectio...
    </ng-template>

    <ng-template #countryTemplate let-countryItem="item">
      <div id="country-iso-name">
        <div class="flag-wrapper">
          <div class="icon-flag" [innerHtml]="countryItem.svgFlag | safeHtml"></div>
        </div>
        <span class="country-name">{{countryItem.name + '(' + countryItem.code + ')'}}</span>
      </div>
    </ng-template>

    <ng-template #personTemplate let-item="item">
      {{item.name.first}}
    </ng-template>

    <div id="examples-cont">
      <h2>Simple select array of strings</h2>
      <selectio-plugin
        [selectionEmptyTemplate]="selectioTemplate"
        [$data]="$stringArray"
        [allowClear]="true"
        (afterSourceItemInit)="afterSourceItemInit($event)"
      ></selectio-plugin>
      <h2>Simple select array of objects</h2>
      <!--<selectio-plugin-->
      <!--[selectionEmptyTemplate]="selectioTemplate"-->
      <!---->
      <!--[listItemTemplate]="countryTemplate"-->
      <!--[$data]="$objectArray"-->
      <!--[selectionDefaultMapper]="selectionDefaultMapper"-->
      <!--&gt;</ng-selectio>-->
      <!--<h2>Simple select array of strings with search</h2>-->
      <!--<selectio-plugin-->
      <!--[selectionEmptyTemplate]="selectioTemplate"-->
      <!--[$data]="$stringArray"-->
      <!--[search]="true"-->
      <!--(onSearch)="onSearchString($event)"-->
      <!--&gt;</ng-selectio>-->
      <!--<h2>Simple select array of strings with search and autocomplete</h2>-->
      <!--<selectio-plugin-->
      <!--[selectionEmptyTemplate]="selectioTemplate"-->
      <!--[$data]="$stringArray"-->
      <!--[search]="true"-->
      <!--[autocomplete]="true"-->
      <!--(onSearch)="onSearchString($event)"-->
      <!--&gt;</ng-selectio>-->
      <!--<h2>Remote data select with search and pagination</h2>-->
      <!--<selectio-plugin-->
      <!--[selectionItemTemplate]="personTemplate"-->
      <!--[listItemTemplate]="personTemplate"-->
      <!--[selectionEmptyTemplate]="selectioTemplate"-->
      <!--[$data]="$users"-->
      <!--[$appendData]="$appendUsers"-->
      <!--[selectionDefault]="this.dataService.exampleRandomUsers"-->
      <!--[selectionMode]="'multiple'"-->
      <!--[search]="true"-->
      <!--[allowClear]="true"-->
      <!--[pagination]="true"-->
      <!--[paginationDelay]="500"-->
      <!--(onSearch)="onSearch($event)"-->
      <!--(onNextPage)="onNextPage($event)"-->
      <!--&gt;</ng-selectio>-->

      <!--<h2>ngmodel</h2>-->
      <!--<div>-->
      <!--<selectio-plugin-->
      <!--[selectionEmptyTemplate]="selectioTemplate"-->
      <!--[(ngModel)]="itemArray"-->
      <!--[$data]="$stringArray"-->
      <!--[dropdownDisabledItemMapper]="disabledItem"-->
      <!--[allowClear]="true"-->
      <!--&gt;-->
      <!--</ng-selectio>-->
      <!--<div class="selected-item">{{itemArray}}</div>-->
      <!--</div>-->
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
  $stringArray: Observable<any> = this.dataService.countriesStrings;
  $objectArray: Observable<any>;
  $users: Observable<any>;
  $appendUsers: Observable<any>;
  itemArray: Item[] = ['russia'];

  constructor(private http: Http, public dataService: DataService) {
    this.$objectArray = this.dataService.countriesData;
  }

  onSearchString(term: string) {
    this.$stringArray = this.dataService.countriesStrings.mergeMap((arr) => {
      return Observable.of(arr.filter((elem) => {
        return (<string>elem).includes(term);
      }));
    });
  }

  // IE 9 BUG https://github.com/angular/angular-cli/issues/6110
  onSearch(term: string) {
    if (term === '') {
      this.$users = Observable.of([]);
    } else {
      this.$users = this.http.get(`https://randomuser.me/api?seed=${term}&inc=gender,name,picture&results=${10}&nat=uk`)
        .map(r => r.json()).map(r => r.results);
    }
  }

  onNextPage(pagination) {
    this.$appendUsers = this.http.get(`https://randomuser.me/api?seed=${pagination.term}&results=${10}&page=${pagination.currentLength / 10 + 1}&nat=uk&inc=gender,name,picture`)
      .map(r => r.json()).map(r => r.results);
  }

  disabledItem(item: any) {
    return item === 'canada';
  }

  afterSourceItemInit(sourceItem: SourceItem) {
    console.log(sourceItem);
  }
}
