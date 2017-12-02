import {Routes} from '@angular/router';
import {HomePageComponent} from "./home-page/home-page.component";
import {BuilderPageComponent} from "./builder-page/builder-page.component";
import {DocsPageComponent} from "./docs-page/docs-page.component";
import {ExamplesPageComponent} from "./examples-page/examples-page.component";

export const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'builder', component: BuilderPageComponent},
  {path: 'docs', component: DocsPageComponent},
  {path: 'examples', component: ExamplesPageComponent}
];
