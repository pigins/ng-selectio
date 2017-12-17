import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {DataService} from '../service/data.service';
import {Item} from '../ng-selectio/types';
import {Template} from '../ng-selectio/types';
import {NgSelectioComponent, SELECTION_MODE_SINGLE} from '../ng-selectio/ng-selectio.component';
import {SelectionMode} from '../ng-selectio/types';

@Component({
  selector: 'app-docs-page',
  styleUrls: ['./docs-page.component.css'],
  template: `
    <div>
      <label for="arrds">Simple array of strings</label><input type="radio" name="mode" value="strings" id="arrds" [ngModel]="datasourceId"
                                                               (ngModelChange)="onChangeRadioDatasource($event)"/>
      <label for="objds">Array of objects</label><input type="radio" name="mode" value="objects" id="objds" [ngModel]="datasourceId"
                                                        (ngModelChange)="onChangeRadioDatasource($event)"/>
      <label for="asyncds">Async datasource</label><input type="radio" name="mode" value="remote_objects" id="asyncds"
                                                          [ngModel]="datasourceId" (ngModelChange)="onChangeRadioDatasource($event)"/>
    </div>
    
    <table>
      <thead>
      <tr>
        <th>Name</th>
        <th>Value</th>
        <th>Description</th>
        <th>Type</th>
        <th>Depends</th>
        <th>Default</th>
      </tr>
      </thead>
      <tbody>
        <tr><td colspan="6">Behavior</td></tr>
        <tr>
          <td>allowClear</td>
          <td>
            <app-checkbox-input
              [(ngModel)]="allowClear">
            </app-checkbox-input>
          </td>
          <td>Allows clearing selection</td>
          <td>boolean</td>
          <td></td>
          <td>false</td>
        </tr>

        <tr>
          <td>autocomplete</td>
          <td>
            <app-checkbox-input
              [(ngModel)]="autocomplete">
            </app-checkbox-input>
          </td>
          <td>Transforms to autocomplete mode</td>
          <td>boolean</td>
          <td></td>
          <td>false</td>
        </tr>

        <tr>
          <td>closeAfterSelect</td>
          <td>
            <app-checkbox-input
              [(ngModel)]="closeAfterSelect">
            </app-checkbox-input>
          </td>
          <td>Close dropdown after selection</td>
          <td>boolean</td>
          <td></td>
          <td>true</td>
        </tr>

        <tr>
          <td>disabled</td>
          <td>
            <app-checkbox-input
              [(ngModel)]="disabled">
            </app-checkbox-input>
          </td>
          <td>Disable control</td>
          <td>boolean</td>
          <td></td>
          <td>false</td>
        </tr>

        <tr>
          <td>dropdownDisabledItemMapper</td>
          <td>
            <app-select-input
              [options]="[{label: 'all disabled', value: dropdownDisabledItemMapper_allDisabled}, {label: 'all enabled', value: dropdownDisabledItemMapper_allEnabled}]"
              [(ngModel)]=dropdownDisabledItemMapper>
            </app-select-input>
          </td>
          <td></td>
          <td>(item: Item) => boolean</td>
          <td></td>
          <td>(item: Item) => false</td>
        </tr>

        <tr>
          <td>openUp</td>
          <td>
            <app-checkbox-input
              [(ngModel)]="openUp">
            </app-checkbox-input>
          </td>
          <td>Open dropdown up</td>
          <td>boolean</td>
          <td></td>
          <td>false</td>
        </tr>

        <tr>
          <td>pagination</td>
          <td>
            <app-checkbox-input
              [(ngModel)]="pagination">
            </app-checkbox-input>
          </td>
          <td>Use pagination</td>
          <td>boolean</td>
          <td></td>
          <td>false</td>
        </tr>

        <tr>
          <td>paginationDelay</td>
          <td>
            <app-number-input
              [(ngModel)]="paginationDelay">
            </app-number-input>
          </td>
          <td>Delay in milliseconds</td>
          <td>number</td>
          <td></td>
          <td>0</td>
        </tr>

        <tr>
          <td>scrollToSelectionAfterOpen</td>
          <td>
            <app-checkbox-input
              [(ngModel)]="scrollToSelectionAfterOpen">
            </app-checkbox-input>
          </td>
          <td>Scroll to selection after open dropdown</td>
          <td>boolean</td>
          <td></td>
          <td>true</td>
        </tr>

        <tr>
          <td>search</td>
          <td>
            <app-checkbox-input
              [(ngModel)]="search">
            </app-checkbox-input>
          </td>
          <td>Use search input</td>
          <td>boolean</td>
          <td></td>
          <td>false</td>
        </tr>

        <tr>
          <td>searchDelay</td>
          <td>
            <app-number-input
              [(ngModel)]="searchDelay">
            </app-number-input>
          </td>
          <td>Search delay</td>
          <td>number</td>
          <td></td>
          <td>0</td>
        </tr>

        <tr>
          <td>searchMinLength</td>
          <td>
            <app-number-input
              [(ngModel)]="searchMinLength">
            </app-number-input>
          </td>
          <td>Search minimal length</td>
          <td>number</td>
          <td></td>
          <td>-1</td>
        </tr>

        <tr>
          <td>selectionDefault</td>
          <td>
            <app-select-input [options]="[{label: 'null', value: null}, {label: 'user', value: selectionDefault_user}]"
                              [(ngModel)]=selectionDefault>
            </app-select-input>
          </td>
          <td>Default selection</td>
          <td>Item | Item[] | null</td>
          <td></td>
          <td>null</td>
        </tr>

        <tr>
          <td>selectionDefaultMapper</td>
          <td>
            <app-select-input style="display: inline-block"
                              [options]="[{label: 'none', value: selectionDefaultMapper_none}, {label: 'select first', value: selectionDefaultMapper_selectFirst}]"
                              [(ngModel)]=selectionDefaultMapper>
            </app-select-input>
            <button (click)="recreateSelectio()" style="display: inline-block">recreate selectio</button>
          </td>
          <td></td>
          <td>(items: Item[]) => Item[]</td>
          <td></td>
          <td>(items: Item[]) => []</td>
        </tr>

        <tr>
          <td>selectionMaxLength</td>
          <td>
            <app-select-input
              [options]="[-1, 1, 2]"
              [(ngModel)]="selectionMaxLength">
            </app-select-input>
          </td>
          <td>Max selection items count</td>
          <td>number</td>
          <td></td>
          <td>-1</td>
        </tr>

        <tr>
          <td>selectionMode</td>
          <td>
            <app-select-input
              [options]="['single', 'multiple']"
              [(ngModel)]="selectionMode">
            </app-select-input>
          </td>
          <td>Single or multiple mode</td>
          <td>'single'|'multiple'</td>
          <td></td>
          <td>'single'</td>
        </tr>

        <tr>
          <td>tabIndex</td>
          <td>
            <app-number-input
              [(ngModel)]="tabIndex">
            </app-number-input>
          </td>
          <td>tabIndex</td>
          <td>number</td>
          <td></td>
          <td>1</td>
        </tr>
        
        <tr>
          <td>trackByFn</td>
          <td>
            <app-select-input
              [options]="[{label: 'none', value: null}, {label: 'by index', value: trackByFn_byIndex}]"
              [(ngModel)]=trackByFn>
            </app-select-input>
          </td>
          <td>Standard angular trackby function for *ngFor</td>
          <td>((index: number, item: Item) => any) | null</td>
          <td></td>
          <td>null</td>
        </tr>
        
        <tr>
          <td colspan="6">View</td>
        </tr>

        <tr>
          <td>dropdownEmptyRenderer</td>
          <td>
            <app-select-input
              [options]="[{label: 'default', value: dropdownEmptyRenderer_default}, {label: 'null', value: null}, {label: 'user', value: dropdownEmptyRenderer_empty}]"
              [(ngModel)]="dropdownEmptyRenderer">
            </app-select-input>
          </td>
          <td>Renderer for empty dropdown content</td>
          <td>Template<() => string></td>
          <td></td>
          <td>Enter 1 or more characters</td>
        </tr>

        <tr>
          <td>dropdownItemRenderer</td>
          <td>
            <app-select-input
              [options]="[{label: 'default', value: itemRenderer_default}, {label: 'country', value: itemRenderer_renderCountry}, {label: 'user', value: itemRenderer_renderUser}]"
              [(ngModel)]=dropdownItemRenderer>
            </app-select-input>
          </td>
          <td>Renderer for item in dropdown</td>
          <td>Template<(item: Item, disabled: boolean) => string></td>
          <td></td>
          <td>
            <span (click)="showDropdownItemRendererDefault = !showDropdownItemRendererDefault">defaultItemRenderer</span>
            <pre *ngIf="showDropdownItemRendererDefault"><code [innerHTML]="defaultItemRendererString"></code></pre>
          </td>
        </tr>
        
        <tr>
          <td>dropdownMaxHeight</td>
          <td>
            <app-text-input
              [(ngModel)]="dropdownMaxHeight">
            </app-text-input>
          </td>
          <td>Max height for dropdown</td>
          <td>string</td>
          <td></td>
          <td>100px</td>
        </tr>
        
        <tr>
          <td>dropdownPaginationMessageRenderer</td>
          <td>
            <app-select-input
              [options]="[{label: 'default', value: dropdownPaginationMessageRenderer_default}, {label: 'null', value: null}]"
              [(ngModel)]="dropdownPaginationMessageRenderer">
            </app-select-input>
          </td>
          <td></td>
          <td>Template<() => string></td>
          <td></td>
          <td>{{dropdownPaginationMessageRenderer_default}}</td>
        </tr>
        
        <tr>
          <td>dropdownPaginationButtonRenderer</td>
          <td>
            <app-select-input
              [options]="[{label: 'default', value: dropdownPaginationButtonRenderer_default}, {label: 'null', value: null}]"
              [(ngModel)]="dropdownPaginationButtonRenderer">
            </app-select-input>
          </td>
          <td>dropdownPaginationButtonRenderer</td>
          <td>Template<() => string></td>
          <td></td>
          <td>{{dropdownPaginationButtonRenderer_default}}</td>
        </tr>

        <tr>
          <td>dropdownSearchingRenderer</td>
          <td>
            <app-select-input
              [options]="[{label: 'default', value: dropdownSearchingRenderer_default}, {label: 'null', value: null}]"
              [(ngModel)]="dropdownSearchingRenderer">
            </app-select-input>
          </td>
          <td>dropdownSearchingRenderer</td>
          <td>Template<() => string></td>
          <td></td>
          <td>{{dropdownSearchingRenderer_default}}</td>
        </tr>

        <tr>
          <td>searchPlaceholder</td>
          <td>
            <app-text-input
              [(ngModel)]="searchPlaceholder">
            </app-text-input>
          </td>
          <td>searchPlaceholder</td>
          <td>string</td>
          <td></td>
          <td>''</td>
        </tr>

        <tr>
          <td>selectionClearRenderer</td>
          <td>
            <app-select-input
              [options]="[{label: 'default', value: selectionClearRenderer_default}, {label: 'X', value: 'X'}]"
              [(ngModel)]="selectionClearRenderer">
            </app-select-input>
          </td>
          <td>selectionClearRenderer</td>
          <td>Template<() => string></td>
          <td></td>
          <td [innerHtml]="selectionClearRenderer_default"></td>
        </tr>

        <tr>
          <td>selectionEmptyRenderer</td>
          <td>
            <app-select-input
              [options]="[{label: 'default', value: selectionEmptyRenderer_default}, {label: 'null', value: null}]"
              [(ngModel)]="selectionEmptyRenderer">
            </app-select-input>
          </td>
          <td>selectionEmptyRenderer</td>
          <td>Template<() => string></td>
          <td></td>
          <td [innerHtml]="selectionEmptyRenderer_default"></td>
        </tr>

        <tr>
          <td>selectionItemRenderer</td>
          <td>
            <app-select-input
              [options]="[{label: 'default', value: itemRenderer_default}, {label: 'country', value: itemRenderer_renderCountry}, {label: 'user', value: itemRenderer_renderUser}]"
              [(ngModel)]="selectionItemRenderer">
            </app-select-input>
          </td>
          <td>selectionItemRenderer</td>
          <td>Template<(item: Item, disabled: boolean) => string></td>
          <td></td>
          <td>
            <span (click)="showSelectionItemRendererDefault = !showSelectionItemRendererDefault">defaultItemRenderer</span>
            <pre *ngIf="showSelectionItemRendererDefault"><code [innerHTML]="defaultItemRendererString"></code></pre>
          </td>
        </tr>
      
      </tbody>
    </table>
    
    <div>
      <p>Select</p>
      <ng-selectio *ngIf="showSelectio"
        [$data]="$data"
        [$appendData]="$appendData"
        [selectionMode]="selectionMode" 
        [selectionDefaultMapper]="selectionDefaultMapper"
        [selectionDefault]="selectionDefault" 
        [scrollToSelectionAfterOpen]="scrollToSelectionAfterOpen"
        [searchDelay]="searchDelay"
        [searchMinLength]="searchMinLength"
        [search]="search"
        [pagination]="pagination"
        [autocomplete]="autocomplete"
        [paginationDelay]="paginationDelay"
        [disabled]="disabled"
        [closeAfterSelect]="closeAfterSelect"
        [selectionMaxLength]="selectionMaxLength"
        [allowClear]="allowClear"
        [openUp]="openUp"
        [dropdownDisabledItemMapper]="dropdownDisabledItemMapper"
        [dropdownItemRenderer]="dropdownItemRenderer"
        [selectionItemRenderer]="selectionItemRenderer"
        [searchPlaceholder]="searchPlaceholder"
        [dropdownMaxHeight]="dropdownMaxHeight"
        [dropdownEmptyRenderer]="dropdownEmptyRenderer"
        [dropdownPaginationMessageRenderer]="dropdownPaginationMessageRenderer" 
        [dropdownPaginationButtonRenderer]="dropdownPaginationButtonRenderer"
        [dropdownSearchingRenderer]="dropdownSearchingRenderer"
        [selectionEmptyRenderer]="selectionEmptyRenderer"
        [selectionClearRenderer]="selectionClearRenderer"
        [tabIndex]="tabIndex"
        [trackByFn]="trackByFn"
        (onSearch)="onSearch($event)"
        (onNextPage)="onNextPage($event)"
      ></ng-selectio>
    </div>
  `
})
export class DocsPageComponent {
  showDropdownItemRendererDefault: boolean = false;
  showSelectionItemRendererDefault: boolean = false;
  defaultItemRendererString: string = `(item: Item) => {
          if (typeof item === 'string') {
            return item;
          } else if (typeof item === 'number') {
            return item + '';
          } else {
            return JSON.stringify(item);
          }
          };`;


  // defaults
  selectionDefault_user: Item;
  selectionDefaultMapper_selectFirst(items: Item[]): Item[] {
    return [items[0]];
  }
  selectionDefaultMapper_none(items: Item[]): Item[] {
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
  dropdownEmptyRenderer_empty = 'select...';
  dropdownPaginationMessageRenderer_default = 'Loading more results...';
  dropdownPaginationButtonRenderer_default = 'Get more...';
  dropdownSearchingRenderer_default = 'Searching...';
  selectionEmptyRenderer_default = 'No data';
  selectionClearRenderer_default = '&#10005';

  $data: Observable<Item[]> = this.dataService.countriesStrings;
  $appendData: Observable<Item[]> = Observable.of([]);

  selectionMode: SelectionMode = SELECTION_MODE_SINGLE;
  selectionDefault: Item | Item[] | null = null;
  selectionDefaultMapper: (items: Item[]) => Item[] = this.selectionDefaultMapper_none;
  allowClear: boolean = false;

  searchDelay: number = 0;
  searchMinLength: number = 0;
  search: boolean = false;
  paginationDelay: number = 0;
  pagination: boolean = false;
  autocomplete: boolean = false;
  disabled: boolean = false;
  closeAfterSelect: boolean = true;
  selectionMaxLength: number = -1;

  dropdownDisabledItemMapper: (item: Item) => boolean = this.dropdownDisabledItemMapper_allEnabled;
  tabIndex: number = 1;
  trackByFn: ((index: number, item: Item) => any) | null = null;
  openUp: boolean = false;
  scrollToSelectionAfterOpen: boolean = true;

  dropdownItemRenderer: Template<(item: Item, disabled: boolean) => string> = this.itemRenderer_default;
  selectionItemRenderer: Template<(item: Item) => string> = this.itemRenderer_default;
  dropdownMaxHeight: string = '100px';
  searchPlaceholder: string = '';
  dropdownEmptyRenderer: Template<() => string> = this.dropdownEmptyRenderer_default;
  dropdownPaginationMessageRenderer: Template<() => string> = this.dropdownPaginationMessageRenderer_default;
  dropdownPaginationButtonRenderer: Template<() => string> = this.dropdownPaginationButtonRenderer_default;
  dropdownSearchingRenderer: Template<() => string> = this.dropdownSearchingRenderer_default;
  selectionEmptyRenderer: Template<() => string> = this.selectionEmptyRenderer_default;
  selectionClearRenderer: Template<() => string> = this.selectionClearRenderer_default;

  datasourceId: string = 'strings';
  showSelectio = true;

  constructor(private http: Http, private dataService: DataService) {
    this.selectionDefault_user = this.dataService.exampleRandomUsers[0];
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

  onNextPage(pagination) {
    if (this.datasourceId === 'remote_objects') {
      this.$appendData = this.http.get(`https://randomuser.me/api?seed=${pagination.term}&results=${10}&page=${pagination.currentLength / 10 + 1}&nat=uk&inc=gender,name,picture`)
        .map(r => r.json()).map(r => r.results);
    }
  }

}
