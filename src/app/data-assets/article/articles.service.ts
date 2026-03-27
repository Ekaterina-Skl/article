import {Injectable, signal} from '@angular/core';
import {Article} from './article.interface';


@Injectable({ providedIn: 'root' })
export class ArticlesService {
  private key = 'articles';

  articles = signal<Article[]>(this.#load());

  #load(): Article[] {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  #persist(data: Article[]) {
    localStorage.setItem(this.key, JSON.stringify(data));
    this.articles.set(data);
  }

  getById(id: string) {
    return this.articles().find(a => a.id === id);
  }

  save(article: Article) {
    const list = [...this.articles()];
    const i = list.findIndex(a => a.id === article.id);

    if (i > -1) list[i] = article;
    else list.push(article);

    this.#persist(list);
  }

  delete(id: string) {
    this.#persist(this.articles().filter(article => article.id !== id));
  }
}
