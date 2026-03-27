import {Injectable} from '@angular/core';
import {Annotation} from './annotation.interface';


@Injectable({ providedIn: 'root' })
export class AnnotationsService {
  #key = 'annotations';

  load(): Annotation[] {
    return JSON.parse(localStorage.getItem(this.#key) || '[]');
  }

  saveAll(list: Annotation[]) {
    localStorage.setItem(this.#key, JSON.stringify(list));
  }

  add(annotation: Annotation) {
    const list = this.load();
    list.push(annotation);
    this.saveAll(list);
  }

  getByArticle(articleId: string) {
    return this.load().filter(a => a.articleId === articleId);
  }
}
