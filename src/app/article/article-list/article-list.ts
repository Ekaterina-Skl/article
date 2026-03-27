import {Component, signal} from '@angular/core';
import { inject } from '@angular/core';
import {Router} from '@angular/router';
import {ArticlesService} from '../../data-assets/article/articles.service';

@Component({
  selector: 'app-article-list',
  standalone: true,
  templateUrl: './article-list.html',
  styleUrl: './article-list.scss'
})
export class ArticleListComponent {
  #service = inject(ArticlesService);
  #router = inject(Router);

  articles = this.#service.articles;
  selectedIds = signal<Set<string>>(new Set());

  open(id: string) {
    this.#router.navigate(['/edit', id]);
  }

  create() {
    this.#router.navigate(['/new']);
  }

  onCheckboxChange(id: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    const set = new Set(this.selectedIds());

    if (checked) {
      set.add(id);
    } else {
      set.delete(id);
    }

    this.selectedIds.set(set);
  }

  isSelected(id: string): boolean {
    return this.selectedIds().has(id);
  }

  deleteSelected() {
    this.selectedIds().forEach(id => this.#service.delete(id));
    this.selectedIds.set(new Set());
  }

  editSelected() {
    const [id] = this.selectedIds();
    this.open(id);
  }
}
