import {Routes} from '@angular/router';
import {DocsPageComponent} from './docs-page/docs-page.component';
import {ExamplesPageComponent} from './examples-page/examples-page.component';

export const routes: Routes = [
  {path: 'docs', component: DocsPageComponent},
  {path: '', component: ExamplesPageComponent}
];
