export function createAnnotationSpan(
  note: string,
  color: string,
  underline = false
): HTMLSpanElement {
  const span = document.createElement('span');

  if (underline) {
    span.className = 'underline';

    span.style.textDecoration = 'underline';
    span.style.textDecorationColor = color;

    return span;
  }

  span.className = 'annotated';
  span.dataset['note'] = note;
  span.style.backgroundColor = color;

  return span;
}
