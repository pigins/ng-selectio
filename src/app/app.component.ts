import {Component} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import {Http} from "@angular/http";
import 'rxjs/add/operator/map';

export const COUNTRIES_DATA = {
  "countries": {
    "uk": {
      "isoName": "uk",
      "name": "Украина",
      "code": "380",
      "svgFlag": "<svg width='29' height='20' xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg'><g><rect y='9' id='svg_1' height='9' width='27' fill='#ffd500'/><rect x='0' y='0' id='svg_2' height='9' width='27' fill='#005bbb'/></g></svg>",
      "mask": "(99)999-99-99",
      "placeholder": "(__)___-__-__"
    },
    "ru": {
      "isoName": "ru",
      "name": "Российская Федерация",
      "code": "7",
      "svgFlag": "<svg width='29' height='20' xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg'><g><rect id='svg_1' height='6' width='27' fill='#fff'/><rect id='svg_2' height='6' width='27' y='12' fill='#d52b1e'/><rect id='svg_3' height='6' width='27' y='6' fill='#0039a6'/></g></svg>",
      "mask": "(999)999-99-99",
      "placeholder": "(___)___-__-__"
    },
    "fr": {
      "isoName": "fr",
      "name": "Франция",
      "code": "35",
      "svgFlag": "<svg width='29' height='20' xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg'><g><rect x='18' id='svg_1' fill='#ED2939' height='18' width='9'/><rect y='0' x='9' id='svg_2' fill='#fff' height='18' width='9'/><rect id='svg_3' fill='#002395' height='18' width='9'/></g></svg>",
      "mask": "(99) 99-999-9",
      "placeholder": "(__) __-___-_"
    },
    "in": {
      "isoName": "in",
      "name": "Индонезия",
      "code": "3577",
      "svgFlag": "<svg width='29' height='20' xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg'><g><rect y='9' id='svg_1' height='9' width='27' fill='#fff''/><rect y='0' id='svg_2' height='9' width='27' fill='#F00'/></g></svg>",
      "mask": "(9999)9999-99",
      "placeholder": "(____)____-__"
    }
  }
};


@Component({
  selector: 'app-root',
  template: `
    <p>Simple select array of strings</p>
    <app-ng-selectio
      [$data]="$stringArray"
    ></app-ng-selectio>

    <p>Simple select array of objects</p>
    <app-ng-selectio
      [$data]="$objectArray"
      [renderItem]="renderCountry"
      [renderSelectionItem]="renderCountry"
      [defaultSelectionRule]="defaultSelectionRule" 
      [bypassSecurityTrustHtml]="true"
      (onSelect)="onSelectCountry($event)"
    ></app-ng-selectio>
    
    <p>Simple select array of strings with search</p>
    <app-ng-selectio
      [$data]="$stringArray"
      [showSearch]="true"
      (onSearch)="onSearchString($event)"
    ></app-ng-selectio>
    
    <p>remote data select with search</p>
    <app-ng-selectio
      [$data]="$users"
      [renderItem]="renderItem"
      [multiple]="true"
      [showSearch]="true"
      (onSearch)="onSearch($event)"

    ></app-ng-selectio>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  strings: string[] = ['russia', 'canada', 'usa', 'germany', 'france' , 'china', 'uk', 'australia', 'bolivia', 'india', 'romania'];
  $stringArray: Observable<any> = Observable.of(this.strings);
  objectArray = Object.keys(COUNTRIES_DATA.countries).map((key) => {
    return Object.assign({id: key}, COUNTRIES_DATA.countries[key]);
  });
  $objectArray: Observable<any>;
  numberArray: Observable<any> = Observable.of(
    [1, 12344, 4235, -1, 0.0001, 3553, 99999999999999, -111111111111, -1e17, 1.999999999999]
  );
  $users: Observable<any>;

  constructor(private http: Http) {
    this.$objectArray = Observable.of(this.objectArray);
  }
  onSearchString(term: string) {
    this.$stringArray = Observable.of(this.strings.filter((elem) => {
      return elem.includes(term);
    }));
  }
  onSearch(term: string) {
    this.$users = this.http.get(`https://randomuser.me/api?seed=${term}&inc=gender,name,picture&results=8&nat=uk`)
      .map(r => r.json()).map(r => r.results);
  }

  renderItem(item: any) {
    return item.name.first;
  }
  defaultSelectionRule(item: any) {
    return item.id === 'fr';
  }
  renderCountry(countryItem: any): string {
    return `<div id="country-iso-name" class=${countryItem.isoName}>
               <div class="flag-wrapper"><div class="icon-flag">${countryItem.svgFlag}</div></div>
               <span class="country-name">${countryItem.name + ' (+' + countryItem.code + ')'}</span>
           </div>`
  }

  onSelectCountry(country: any) {
    console.log(country);
  }
}
