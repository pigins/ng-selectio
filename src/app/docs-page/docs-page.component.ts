import {Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {DataService} from '../service/data.service';
import {Item} from '../selectio/types';
import {SelectioPluginComponent, SELECTION_MODE_SINGLE} from '../selectio/selectio-plugin.component';
import {SelectionMode} from '../selectio/types';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-docs-page',
  styleUrls: ['./docs-page.component.css'],
  templateUrl: './docs-page.component.html',
  encapsulation: ViewEncapsulation.None
})
export class DocsPageComponent implements OnInit, OnDestroy {

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
  selectionDefault_user: Item;

  dropdownDisabledItemMapper_allDisabled(item: Item): boolean {
    return true;
  }
  dropdownDisabledItemMapper_allEnabled(item: Item): boolean {
    return false;
  }
  trackByFn_byIndex(index: number, item: Item): any {
    return index;
  }

  $data: Observable<Item[]> = this.dataService.countriesData;
  $appendData: Observable<Item[]> = Observable.of([]);

  selectionMode: SelectionMode = SELECTION_MODE_SINGLE;
  selectionDefault: Item | Item[] | null = null;
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
  clearSearchAfterCollapse: boolean = true;
  dropdownMaxHeight: string = '150px';
  searchPlaceholder: string = '';


  showSelectio = true;

  DATA_LOCAL_ID = 'objects';
  DATA_REMOTE_ID = 'remote_objects';
  datasourceId: string = this.DATA_LOCAL_ID;

  private fixed: boolean;
  private menuPositionChange = new EventEmitter<boolean>();

  @ViewChild('selectio') selectio: SelectioPluginComponent;
  @ViewChild('menu') menu: ElementRef;
  @ViewChild('container') container: ElementRef;

  constructor(private http: Http, private dataService: DataService, private router: Router) {
    this.selectionDefault_user = this.dataService.exampleRandomUsers[0];

    router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
        const tree = router.parseUrl(router.url);
        if (tree.fragment) {
          const element = document.querySelector("#" + tree.fragment);
          if (element) { element.scrollIntoView(true); }
        }
      }
    });
  }

  ngOnInit(): void {
    this.menuPositionChange.subscribe(fixed => {
      if (fixed) {
        this.menu.nativeElement.style.position = 'fixed';
        this.menu.nativeElement.style.left = this.container.nativeElement.getBoundingClientRect().right + 'px';
        this.menu.nativeElement.style.top = '10px';
      } else {
        this.menu.nativeElement.style.position = 'absolute';
        this.menu.nativeElement.style.left = '100%';
        this.menu.nativeElement.style.top = '60px';
      }
    });
    this.menuPositionChange.emit(false);
  }

  ngOnDestroy(): void {
    this.menuPositionChange.unsubscribe();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    let fixed = window.pageYOffset > this.menu.nativeElement.offsetHeight;
    if (this.fixed != fixed) {
      this.menuPositionChange.emit(fixed);
    }
    this.fixed = fixed;
  }

  recreateSelectio() {
    this.showSelectio = false;
    setTimeout(()=> {
      this.showSelectio = true;
    }, 100);
  }

  onChangeRadioDatasource(id: string) {
    if (id === this.DATA_LOCAL_ID) {
      this.datasourceId = id;
      this.$data = this.dataService.countriesData;
    } else if (id === this.DATA_REMOTE_ID) {
      this.datasourceId = id;
      this.$data = Observable.of([]);
    }
  }

  onSearch(term: string) {
    if (this.isRemote()) {
      if (term === '') {
        this.$data = Observable.of([]);
      } else {
        this.$data = this.http.get(`https://randomuser.me/api?seed=${term}&inc=gender,name,picture&results=${10}&nat=uk`)
          .map(r => r.json()).map(r => r.results);
      }
    } else if (this.isLocal()) {
      this.$data = this.dataService.countriesData.mergeMap((arr) => {
        return Observable.of(arr.filter((elem) => {
          return ((<any>elem).name).includes(term);
        }));
      });
    }
  }

  onNextPage(pagination) {
    if (this.isRemote()) {
      this.appendUser(pagination);
    }
  }

  onManualAppend() {
   let term = '';
   if (this.selectio.searchComponent) {
     term = this.selectio.searchComponent.getValue();
   }
   this.appendUser({term: term, currentLength: this.selectio.source.size()});
  }

  appendUser(pagination) {
    this.$appendData = this.http.get(`https://randomuser.me/api?seed=${pagination.term}&results=${10}&page=${pagination.currentLength / 10 + 1}&nat=uk&inc=gender,name,picture`)
      .map(r => r.json()).map(r => r.results);
  }

  isLocal(): boolean {
    return this.datasourceId === this.DATA_LOCAL_ID;
  }

  isRemote(): boolean {
    return this.datasourceId === this.DATA_REMOTE_ID;
  }

  isSectionActive(section: string): boolean {
    return location.href.indexOf(section) !== -1;
  }
}
