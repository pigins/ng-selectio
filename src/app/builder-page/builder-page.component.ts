import { Component } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {DataService} from '../service/data.service';

@Component({
  selector: 'app-builder-page',
  templateUrl: './builder-page.component.html',
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
  defaultSelectionRule(items: any[]): any[] {
    return [items[0]];
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
}
