import type { FilterItem } from '../../shared/types';
import { createFilterItemEl } from './FilterItem';
import { DragManager } from '../drag/DragManager';

interface FilterListOptions {
  onActivate: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder: (ids: string[]) => void;
}

export class FilterList {
  readonly el: HTMLUListElement;
  private drag: DragManager;

  constructor(container: HTMLElement, private options: FilterListOptions) {
    this.el = document.createElement('ul');
    this.el.className = 'jfs-filter-list';
    container.appendChild(this.el);

    this.drag = new DragManager();
    this.drag.attach(this.el, { onReorder: options.onReorder });
  }

  render(filters: FilterItem[], activeId: string | null): void {
    this.el.innerHTML = '';

    if (!filters.length) {
      const empty = document.createElement('li');
      empty.className = 'jfs-empty';
      empty.textContent = 'No filters yet. Click + to add one.';
      this.el.appendChild(empty);
      return;
    }

    filters.forEach((item) => {
      const li = createFilterItemEl(item, item.id === activeId, {
        onActivate: this.options.onActivate,
        onEdit: this.options.onEdit,
        onDelete: this.options.onDelete,
      });
      this.el.appendChild(li);
    });
  }
}
