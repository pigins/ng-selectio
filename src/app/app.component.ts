import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {Http} from '@angular/http';
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

// open on top rule
@Component({
  selector: 'app-root',
  template: `
    <button (click)="disabled = !disabled">{{disabled?'enable':'disable'}}</button>
    <button (click)="closeOnSelect = !closeOnSelect">{{closeOnSelect?'not close on select':'close on select'}}</button>
    <div>
      <label style="display: inline-block">maxSelectionLength</label><input type="number" (change)="maxSelectionLength = $event.srcElement.value" style="display: inline-block"/>
    </div>
    <div>
      <label style="display: inline-block">max-dropdown-height</label>
      <select (change)="maxDropdownHeight = $event.srcElement.value" style="display: inline-block">
        <option value="100px">100px</option>
        <option value="200px">200px</option>
      </select>
    </div>
    <div>
      <label>Open on top</label>
      <input (change)="openOnTop = $event.target.checked" type="checkbox"/>
    </div>
    
     
    <p>Simple select array of strings</p>
    <app-ng-selectio
      [$data]="$stringArray"
      [disabled]="disabled"
      [closeOnSelect]="closeOnSelect"
      [selectionEmptyRenderer]="noDataRenderer"
      [dropdownMaxHeight]="maxDropdownHeight" 
      [dropdownDisabledItemMapper]="disabledItem"
      [tabIndex]="-1"
      [selectionDeletable]="true"
      [openOnTop]="openOnTop"
    ></app-ng-selectio>

    <p>Simple select array of objects</p>
    <app-ng-selectio
      [$data]="$objectArray"
      [dropdownItemRenderer]="{template:renderCountry, bypassSecurityTrustHtml:true}"
      [selectionItemRenderer]="{template:renderCountry, bypassSecurityTrustHtml:true}"
      [defaultSelectionRule]="defaultSelectionRule"
      [dropdownMaxHeight]="maxDropdownHeight"
      [disabled]="disabled"
      [openOnTop]="openOnTop" 
      [closeOnSelect]="closeOnSelect"
      (onSelect)="onSelectCountry($event)"
      
    ></app-ng-selectio>

    <p>Simple select array of strings with search</p>
    <app-ng-selectio
      [$data]="$stringArray"
      [disabled]="disabled"
      [closeOnSelect]="closeOnSelect"
      [dropdownMaxHeight]="maxDropdownHeight"
      [showSearch]="true"
      [openOnTop]="openOnTop"
      (onSearch)="onSearchString($event)"
    ></app-ng-selectio>

    <p>Simple select array of strings with search and autocomplete</p>
    <app-ng-selectio
      [$data]="$stringArray"
      [disabled]="disabled"
      [closeOnSelect]="closeOnSelect"
      [dropdownMaxHeight]="maxDropdownHeight"
      [showSearch]="true"
      [autocomplete]="true"
      [openOnTop]="openOnTop"
      (onSearch)="onSearchString($event)"
    ></app-ng-selectio>
    
    <p>remote data select with search and paging</p>
    <app-ng-selectio
      [$data]="$users"
      [$appendData]="$appendUsers"
      [disabled]="disabled"
      [closeOnSelect]="closeOnSelect"
      [maxSelectionLength] = "maxSelectionLength"
      [dropdownItemRenderer]="renderItem"
      [dropdownMaxHeight]="maxDropdownHeight"
      [selectionItemRenderer]="renderItem"
      [selectionMode]="'multiple'"
      [showSearch]="true"
      [selectionDeletable]="true"
      [paging]="true"
      [pagingDelay]="500"
      [openOnTop]="openOnTop"
      (onSearch)="onSearch($event)"
      (onNextPage)="onNextPage($event)"
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

  $users: Observable<any>;
  $appendUsers: Observable<any>;

  disabled = false;
  closeOnSelect = true;
  maxSelectionLength: number = -1;
  maxDropdownHeight: string = '100px';
  openOnTop = false;

  constructor(private http: Http) {
    this.$objectArray = Observable.of(this.objectArray);
  }
  onSearchString(term: string) {
    this.$stringArray = Observable.of(this.strings.filter((elem) => {
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
    this.$appendUsers = this.http.get(`https://randomuser.me/api?seed=${paging.term}&results=${10}&page=${paging.currentLength/10 + 1}&nat=uk&inc=gender,name,picture`)
      .map(r => r.json()).map(r => r.results);
  }

  disabledItem(item: any) {
    return item === 'canada'
  }

  renderItem(item: any) {
    return item.name.first;
  }
  defaultSelectionRule(items: any[]): any[] {
    return [items[0]];
  }
  renderCountry(countryItem: any): string {
    //console.log(countryItem);
    return `<div id="country-iso-name" class=${countryItem.isoName}>
               <div class="flag-wrapper"><div class="icon-flag">${countryItem.svgFlag}</div></div>
               <span class="country-name">${countryItem.name + ' (+' + countryItem.code + ')'}</span>
           </div>`
  }
  onChangeMaxSelection(change: Event) {
    //console.log((<any>change.srcElement).value);
  }
  noDataRenderer() {
    return 'Нет данных';
  }
  onSelectCountry(country: any) {
    //console.log(country);
  }


}
