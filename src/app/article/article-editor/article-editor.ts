import {afterNextRender, Component, computed, ElementRef, signal, viewChild} from '@angular/core';
import { inject } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {debounceTime, Subject} from 'rxjs';
import {ArticlesService} from '../../data-assets/article/articles.service';
import {AnnotationsService} from '../../data-assets/article/annotations.service';
import {createAnnotationSpan} from '../../shared/annotation.util';
import {FormControl, ReactiveFormsModule} from '@angular/forms';


@Component({
  selector: 'app-article-editor',
  standalone: true,
  templateUrl: './article-editor.html',
  imports: [
    ReactiveFormsModule
  ],
  styleUrl: './article-editor.scss'
})
export class ArticleEditorComponent {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #articles = inject(ArticlesService);
  #annotations = inject(AnnotationsService);

  editorRef = viewChild<ElementRef>('editor');

  id = signal<string>(crypto.randomUUID());
  mode = signal<'create' | 'edit'>('create');

  #save$ = new Subject<void>();
  titleControl = new FormControl<string>('', { nonNullable: true });

  constructor() {
    const id = this.#route.snapshot.paramMap.get('id');

    if (id) {
      this.mode.set('edit');

      const article = this.#articles.getById(id);

      if (article) {
        this.id.set(article.id);
        this.titleControl.setValue(article.title);

        afterNextRender(() => {
          const editor = this.editorRef();
          if (!editor) return;

          editor.nativeElement.innerHTML = article.content;
        });
      }
    }

    this.#save$.pipe(debounceTime(500)).subscribe(() => {
      this.save(false);
    });
  }

  isEditMode = computed(() => this.mode() === 'edit');

  onInput() {
    this.#save$.next();
  }

  underline(color: string) {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);

    if (!this.isValidRange(range)) return;

    const span = createAnnotationSpan('', color, true);

    range.surroundContents(span);
  }

  annotate(color: string) {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);

    if (!this.isValidRange(range)) return;

    const note = prompt('Комментарий') || '';

    const span = createAnnotationSpan(note, color);

    range.surroundContents(span);

    this.#annotations.add({
      id: crypto.randomUUID(),
      articleId: this.id(),
      note,
      color,
      underline: false
    });
  }

  save(navigate: boolean = true) {
    const content = this.editorRef()?.nativeElement.innerHTML || '';

    this.#articles.save({
      id: this.id(),
      title: this.titleControl.value,
      content
    });

    if (navigate) {
      this.#router.navigate(['/']);
    }
  }

  isValidRange(range: Range): boolean {
    return range.startContainer === range.endContainer;
  }

}
