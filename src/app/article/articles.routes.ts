import {Routes} from '@angular/router';
import {ArticleListComponent} from './article-list/article-list';
import {ArticleEditorComponent} from './article-editor/article-editor';

export const ARTICLES_ROUTES: Routes = [
  { path: '', component: ArticleListComponent },
  { path: 'new', component: ArticleEditorComponent },
  { path: 'edit/:id', component: ArticleEditorComponent }
];
