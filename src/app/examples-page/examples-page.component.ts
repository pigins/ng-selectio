import {Component, ViewEncapsulation} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {DataService} from '../service/data.service';
import {Item} from '../ng-selectio/types';

@Component({
  selector: 'app-examples-page',
  templateUrl: './examples-page.component.html',
  styleUrls: ['./examples-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ExamplesPageComponent {
  $stringArray: Observable<any> = this.dataService.countriesStrings;
  $objectArray: Observable<any>;
  $users: Observable<any>;
  $appendUsers: Observable<any>;
  itemArray: Item[] = ['russia'];


  constructor(private http: Http, public dataService: DataService ) {
    this.$objectArray = this.dataService.countriesData;
  }
  onSearchString(term: string) {
    this.$stringArray = this.dataService.countriesStrings.mergeMap((arr) => {
      return Observable.of(arr.filter((elem) => {
        return (<string>elem).includes(term);
      }));
    });
  }
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

  renderItem(item: any) {
    return item.name.first;
  }
  selectionDefaultMapper(items: any[]): any[] {
    return [items[0]];
  }
  renderCountry(countryItem: any): string {
    return `<div id="country-iso-name" class=${countryItem.isoName}>
               <div class="flag-wrapper"><div class="icon-flag">${countryItem.svgFlag}</div></div>
               <span class="country-name">${countryItem.name + ' (+' + countryItem.code + ')'}</span>
           </div>`;
  }
  selectioRenderer() {
    return 'Selectio...';
  }
}
