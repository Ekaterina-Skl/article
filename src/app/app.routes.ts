import { Routes } from '@angular/router';
import {ARTICLES_ROUTES} from './article/articles.routes';

export const routes: Routes = [
  {
    path: '',
    children: ARTICLES_ROUTES
  }
];
